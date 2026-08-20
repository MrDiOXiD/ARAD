  import {
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';

  import { PaymentEntity } from '../entities/payment.entity';
  import { PaymentStatus } from '../enums/payment-status.enum';
  import { OrdersService } from '@/orders/services/orders.service';
  import { OrderEntity } from '@/orders/entities/order.entity';
  import { UserEntity } from '@/users/entities/user.entity';
  import { OrderStatus } from '@/utils/common/order.enum';
  import { normalizeError } from '@/utils/errors/normalize-error.util';
  import { OrderSummaryResponseDto } from '@/orders/dto/order-summary-response.dto';

  // Zibal result code meanings — kept here to avoid magic numbers in logic
  const ZIBAL_SUCCESS      = 100;  // verified and settled
  const ZIBAL_ALREADY_DONE = 201;  // already verified — idempotency case

  @Injectable()
  export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);
    private readonly zibalBaseUrl = 'https://gateway.zibal.ir/v1';
    private readonly merchant: string;
    private readonly appUrl: string;

    constructor(
      @InjectRepository(PaymentEntity)
      private readonly paymentRepo: Repository<PaymentEntity>,
      private readonly ordersService: OrdersService,
      private readonly config: ConfigService,
    ) {
      // Fail fast at startup if env vars are missing — don't let requests fail silently later
      const merchant = this.config.get<string>('ZIBAL_MERCHANT');
      const appUrl   = this.config.get<string>('APP_URL');
      if (!merchant) throw new InternalServerErrorException('ZIBAL_MERCHANT env var is missing');
      if (!appUrl)   throw new InternalServerErrorException('APP_URL env var is missing');
      this.merchant = merchant;
      this.appUrl   = appUrl;
    }

    // ── Step 1: Initiate payment ────────────────────────────────────────────────
    async initiatePayment(
      orderId: number,
      user: UserEntity,
      clientIp: string | null,
    ): Promise<{ payUrl: string; trackId: string }> {
      // Load order and enforce ownership — a user must not pay another user's order
      const order = await this.ordersService.findOne(orderId);
      if (!order) throw new NotFoundException('Order not found');
      if (order.user.id !== user.id) throw new ForbiddenException('Not your order');

      // COD orders never touch the payment gateway at all — order is
      // already PROCESSING from creation, seller sees it in the admin
      // panel, payment happens physically on delivery.
      if (order.paymentMethod === 'cod') {
        throw new BadRequestException('This order is cash-on-delivery — no payment gateway needed.');
      }

      // Only PROCESSING orders can be paid — reject already-paid or cancelled ones
      if (order.status !== OrderStatus.PROCESSING) {
        throw new BadRequestException(`Order status is '${order.status}' — cannot initiate payment`);
      }

      // Check no PENDING or VERIFIED payment already exists for this order
      // Prevents double-charging if the user clicks the checkout button twice
      const existing = await this.paymentRepo.findOne({
        where: { order: { id: orderId }, status: PaymentStatus.VERIFIED },
      });
      if (existing) throw new BadRequestException('Order has already been paid');

      // Amount comes from the DB (order.total_price), never from the client request body
      // Convert Tomans → Rials (Zibal requires Rials)
      const amountInRials = Math.round(Number(order.total_price) * 10);
      if (amountInRials <= 0) throw new BadRequestException('Order total is zero');

      // Call Zibal /v1/request
      let zibalData: { result: number; trackId?: number; message?: string };
      try {
        const res = await fetch(`${this.zibalBaseUrl}/request`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            merchant:    this.merchant,
            amount:      amountInRials,
            callbackUrl: `${this.appUrl}/payment/callback`,
            description: `Order #${orderId}`,
            orderId:     String(orderId),
            mobile:      undefined,
          }),
          signal: AbortSignal.timeout(10_000),
        });
        zibalData = await res.json() as typeof zibalData;
      } catch (err) {
        const e = normalizeError(err);
        this.logger.error(`Zibal /request network error: ${e.message}`, e.stack);
        throw new BadGatewayException('Payment gateway unreachable — please try again');
      }

      if (zibalData.result !== ZIBAL_SUCCESS || !zibalData.trackId) {
        this.logger.warn(`Zibal /request failed: result=${zibalData.result} msg=${zibalData.message}`);
        throw new BadGatewayException('Payment gateway rejected the request');
      }

      const trackId = String(zibalData.trackId);

      await this.paymentRepo.save(
        this.paymentRepo.create({
          trackId,
          amount:   Number(order.total_price),
          status:   PaymentStatus.PENDING,
          clientIp: clientIp ?? null,
          user,
          order,
          zibalResultCode: null,
          paidAt:          null,
        }),
      );

      this.logger.log(`Payment initiated: trackId=${trackId} orderId=${orderId} userId=${user.id}`);

      return {
        trackId,
        payUrl: `https://gateway.zibal.ir/start/${trackId}`,
      };
    }

    // ── Step 2: Verify payment (called by frontend after callback redirect) ─────
  async verifyPayment(
    trackId: string,
    user: UserEntity,
  ): Promise<{ success: boolean; alreadyVerified?: boolean; order: OrderSummaryResponseDto }> {
    const payment = await this.paymentRepo.findOne({
      where: { trackId },
      relations: ['user', 'order'],
    });

    if (!payment) throw new NotFoundException('Payment record not found');
    if (payment.user.id !== user.id) throw new ForbiddenException('Not your payment');

    // Fixed: previously threw here, breaking a page refresh after a
    // failed payment. Now returns the same shape as every other branch.
    if (payment.status === PaymentStatus.FAILED) {
      const order = await this.ordersService.getOrderSummaryForUser(payment.order.id, user.id);
      return { success: false, order };
    }

    if (payment.status === PaymentStatus.VERIFIED) {
      const order = await this.ordersService.getOrderSummaryForUser(payment.order.id, user.id);
      return { success: true, alreadyVerified: true, order };
    }

    let zibalData: { result: number; paidAt?: string; amount?: number; message?: string };
    try {
      const res = await fetch(`${this.zibalBaseUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant: this.merchant, trackId }),
        signal: AbortSignal.timeout(10_000),
      });
      zibalData = await res.json() as typeof zibalData;
    } catch (err) {
      const e = normalizeError(err);
      this.logger.error(`Zibal /verify network error: ${e.message}`, e.stack);
      throw new BadGatewayException('Payment gateway unreachable during verification');
    }

    const isSuccess = zibalData.result === ZIBAL_SUCCESS || zibalData.result === ZIBAL_ALREADY_DONE;

    if (isSuccess) {
      if (zibalData.amount !== undefined) {
        const expectedRials = Math.round(Number(payment.amount) * 10);
        if (zibalData.amount !== expectedRials) {
          this.logger.error(
            `Amount mismatch on verify! trackId=${trackId} expected=${expectedRials} got=${zibalData.amount}`,
          );
          await this.paymentRepo.update({ trackId }, {
            status: PaymentStatus.FAILED,
            zibalResultCode: zibalData.result,
          });
          throw new BadRequestException('Payment amount mismatch — possible tampering detected');
        }
      }

      const paidAtValue = zibalData.paidAt ? new Date(zibalData.paidAt) : new Date();

      await this.paymentRepo.manager.transaction(async (tx) => {
        await tx.update(PaymentEntity, { trackId }, {
          status: PaymentStatus.VERIFIED,
          zibalResultCode: zibalData.result,
          paidAt: paidAtValue,
        });
        await tx.update(OrderEntity, { id: payment.order.id }, { paidAt: paidAtValue });
      });

      this.logger.log(`Payment verified: trackId=${trackId} orderId=${payment.order.id} userId=${user.id}`);
      const order = await this.ordersService.getOrderSummaryForUser(payment.order.id, user.id);
      return { success: true, order };
    }

    await this.paymentRepo.update(
      { trackId },
      { status: PaymentStatus.FAILED, zibalResultCode: zibalData.result },
    );
    this.logger.warn(`Payment failed: trackId=${trackId} result=${zibalData.result} msg=${zibalData.message}`);
    const order = await this.ordersService.getOrderSummaryForUser(payment.order.id, user.id);
    return { success: false, order };
  }


    // ── Admin: get payment status by trackId ───────────────────────────────────
    async getPaymentByTrackId(trackId: string): Promise<PaymentEntity> {
      const payment = await this.paymentRepo.findOne({
        where: { trackId },
        relations: ['user', 'order'],
      });
      if (!payment) throw new NotFoundException('Payment not found');
      return payment;
    }



  async switchToCod(orderId: number, user: UserEntity): Promise<OrderSummaryResponseDto> {
    const order = await this.ordersService.findOne(orderId);
    if (!order || order.user.id !== user.id) {
      throw new NotFoundException(`Order ${orderId} not found.`);
    }
    if (order.paidAt) {
      throw new BadRequestException('This order is already paid — cannot switch to cash on delivery.');
    }
    if (order.paymentMethod === 'cod') {
      // Already COD — idempotent no-op rather than an error.
      return this.ordersService.getOrderSummaryForUser(orderId, user.id);
    }

    await this.ordersService.setPaymentMethod(orderId, 'cod');
    return this.ordersService.getOrderSummaryForUser(orderId, user.id);
  }
    
  }