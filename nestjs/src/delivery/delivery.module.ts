import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryMethodEntity } from './entities/delivery-method.entity';
import { DeliveryMethodsController } from './controllers/delivery-methods.controller';
import { DeliveryMethodsService } from './services/delivery-methods.service';
@Module({
  imports: [TypeOrmModule.forFeature([DeliveryMethodEntity])],
  controllers: [DeliveryMethodsController],
  providers: [DeliveryMethodsService],
  exports: [DeliveryMethodsService], // OrdersModule needs this to compute fees at order creation
})
export class DeliveryModule {}
