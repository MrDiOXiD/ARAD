import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controller/orders.controller';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingEntity } from './entities/shipping.entity';
import { OrderProductsEntity } from './entities/order-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/audit.services';


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
  providers: [OrdersService, AuditService],
})
export class OrdersModule {}
