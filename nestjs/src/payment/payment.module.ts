import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentEntity } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controller/payment.controller';
import { OrdersModule } from '@/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    // forwardRef prevents circular dependency if OrdersModule ever imports PaymentModule
    forwardRef(() => OrdersModule),
  ],
  controllers: [PaymentController],
  providers:   [PaymentService],
  exports:     [PaymentService], // exported in case other modules (e.g. webhooks) need it
})
export class PaymentModule {}
