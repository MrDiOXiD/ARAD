import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controller/orders.controller';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingEntity } from './entities/shipping.entity';
import { OrderProductsEntity } from './entities/order-product.entity';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/audit.services';
import { ProductEntity } from '@/products/entities/product.entity';
import { ProductsModule } from '@/products/products.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      ShippingEntity,
      OrderProductsEntity,
      ProductEntity,
    ]),
    ProductsModule,
    forwardRef(() => AuditModule),
  ],
  controllers: [OrdersController],
  providers:   [OrdersService, AuditService],
  // Export OrdersService so PaymentModule can inject it without circular deps
  exports:     [OrdersService],
})
export class OrdersModule {}
