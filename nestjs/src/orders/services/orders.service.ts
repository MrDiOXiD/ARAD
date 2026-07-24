import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderEntity } from '../entities/order.entity';
import { ShippingEntity } from '../entities/shipping.entity';
// NOTE: adjust this import to match the real path/name of your
// order-line-item entity in this codebase (the one referenced by
// OrderEntity.products). It was not included in what was shared,
// so the name/path below is a best guess and may need correcting.
import { OrderProductDto } from '../dto/order-product.dto';
import { UpdateOrderStatus } from '../dto/update-order-status.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { AuditService } from '../../audit/audit.services';
import { OrderStatus } from '../../utils/common/order.enum';
import { normalizeError } from '../../utils/errors/normalize-error.util';
import { CreateShippingDto } from '../dto/shipping.dto';
import { ProductEntity } from '@/products/entities/product.entity';
import { ProductsService } from '@/products/services/products.service';
import { OrderProductsEntity } from '../entities/order-product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    // Fixed: this parameter had both @InjectEntityManager() and
    // @InjectRepository(ProductEntity) stacked on it, which is invalid —
    // it was being injected as an EntityManager, not a Repository, so the
    // ProductEntity decorator was silently wrong and could throw at
    // bootstrap depending on provider registration order.
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly auditService: AuditService,
    private readonly productServices: ProductsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: UserEntity) {
    // Fixed: was not awaited, so a NotFoundException thrown inside for a
    // missing product became an unhandled promise rejection and crashed
    // the whole Node process instead of returning an HTTP 404.
    const totalOrderPrice = await this.calculateTotalPrice(
      createOrderDto.orderProducts,
    );

    const shippingEntity = await this.createShippingEntity(
      createOrderDto.shippingAddress,
    );

    const order = new OrderEntity();
    order.user = user;
    order.shippingAddress = shippingEntity;
    order.shippedAt = null;
    order.status = OrderStatus.PROCESSING;

    // Fixed: order.products was hard-set to an empty array and the
    // requested line items were never attached, so every order was
    // persisted with zero products regardless of what was ordered.
    order.products = createOrderDto.orderProducts.map((productDto) => {
      const orderProduct = new OrderProductsEntity();
      // Assigning by id reference only — avoids loading full product
      // rows here and avoids trusting any product data the client sent
      // beyond the id/quantity that were already validated by the DTO.
      orderProduct.product = { id: productDto.productId } as ProductEntity;
      orderProduct.order_quantity = productDto.order_quantity;
      return orderProduct;
    });

    try {
      await this.entityManager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(ShippingEntity, shippingEntity);
        // Saving the order also persists order.products in the same
        // transaction as long as OrderEntity.products has cascade: true
        // configured on its relation. If it doesn't, add an explicit
        // transactionalEntityManager.save(OrderProductEntity, order.products)
        // call here so line items aren't silently dropped.
        await transactionalEntityManager.save(OrderEntity, order);
      });
    } catch (error) {
      const err = normalizeError(error);
      // Fixed: the previous catch block logged the failure but never
      // threw or returned anything, so createOrder() resolved to
      // `undefined` on failure and the controller sent back a 201 with
      // an empty body — the caller had no way to know the order failed.
      this.auditService.failedOrder(user.id, order.id, err.message, err.stack);

      // Security: don't leak internal error details (stack traces, raw
      // DB error messages, etc.) to the client. Log the real error via
      // the audit service above, but surface only a generic message.
      throw new InternalServerErrorException('Failed to create order.');
    }

    this.auditService.logOrderPlacement(user.id, order.id);
    const savedOrder = await this.findOne(order.id);
    return { order: savedOrder, totalPrice: totalOrderPrice };
  }

  async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find({
      relations: ['shippingAddress', 'user', 'products'],
    });
  }

  /**
   * Returns the order, or null if it doesn't exist. Use this internally
   * when the caller already handles the not-found case itself (e.g.
   * updateOrderStatus, cancelOrder below).
   */
  async findOne(id: number): Promise<OrderEntity | null> {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.shippingAddress', 'shippingAddress')
      .leftJoinAndSelect('order.user', 'user')
      .addSelect(['user.username', 'user.email'])
      .leftJoinAndSelect('order.products', 'products')
      .leftJoin('products.product', 'product')
      .addSelect(['product.id', 'product.title', 'product.price'])
      .where('order.id = :id', { id })
      .getOne();
  }

  /**
   * Same as findOne, but throws a 404 when the order doesn't exist.
   * Use this from controllers (e.g. GET /orders/:id) — findOne() on its
   * own would let a missing order fall through as a 200 response with
   * a null body instead of a proper 404.
   */
  async findOneOrFail(id: number): Promise<OrderEntity> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
    return order;
  }

  async updateOrderStatus(
    id: number,
    updateOrderDto: UpdateOrderStatus,
    user: UserEntity,
  ) {
    const order = await this.findOneOrFail(id);

    this.validateOrderStatusUpdate(order, updateOrderDto);

    order.status = updateOrderDto.status;
    order.updatedBy = user;

    if (updateOrderDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }

    if (updateOrderDto.status === OrderStatus.DELIVERED) {
      order.orderAt = new Date();
      await this.updateProductStock(order, OrderStatus.DELIVERED);
    }

    await this.orderRepository.save(order);
    return order;
  }

  async cancelOrder(id: number, user: UserEntity) {
    const order = await this.findOneOrFail(id);

    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }

    // Fixed: a delivered order was previously cancellable too (only
    // CANCELLED was excluded). Once stock has been released back for a
    // delivered order, cancelling it afterwards would double-adjust
    // stock in updateProductStock below.
    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('A delivered order cannot be cancelled.');
    }

    order.updatedBy = user;
    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
    await this.updateProductStock(order, OrderStatus.CANCELLED);

    return order;
  }

  private async updateProductStock(order: OrderEntity, status: OrderStatus) {
    for (const orderProduct of order.products) {
      await this.productServices.updateStock(
        orderProduct.product.id,
        orderProduct.order_quantity,
        status,
      );
    }
  }

  private async calculateTotalPrice(
    orderProducts: OrderProductDto[],
  ): Promise<number> {
    let total = 0;

    for (const productDto of orderProducts) {
      // Fixed: findOne() rejects with NotFoundException when the product
      // doesn't exist, so this loop already surfaces a proper 404 as
      // long as the caller awaits calculateTotalPrice() (see createOrder
      // above) — no extra null check needed here.
      const product = await this.productServices.findOne(
        productDto.productId,
      );
      total += productDto.order_quantity * product.price;
    }

    return total;
  }

  private validateOrderStatusUpdate(
    order: OrderEntity,
    updateOrderDto: UpdateOrderStatus,
  ) {
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException(`Order is already ${order.status}.`);
    }

    // Fixed: the previous version only blocked an invalid jump straight
    // to DELIVERED when the current status was PROCESSING — an order
    // still in PENDING could be marked DELIVERED directly, skipping
    // SHIPPED entirely. This now enforces the same rule for every
    // status that isn't already SHIPPED.
    if (
      updateOrderDto.status === OrderStatus.DELIVERED &&
      order.status !== OrderStatus.SHIPPED
    ) {
      throw new BadRequestException(
        'Order must be marked as Shipped before it can be Delivered.',
      );
    }

    if (
      updateOrderDto.status === OrderStatus.SHIPPED &&
      order.status === OrderStatus.SHIPPED
    ) {
      throw new BadRequestException('Order has already been shipped.');
    }
  }

  private async createShippingEntity(
    shippingAddress: CreateShippingDto,
  ): Promise<ShippingEntity> {
    const shippingEntity = new ShippingEntity();
    shippingEntity.phone = shippingAddress.phone;
    shippingEntity.name = shippingAddress.name;
    shippingEntity.address = shippingAddress.address;
    shippingEntity.city = shippingAddress.city;
    return shippingEntity;
  }
}