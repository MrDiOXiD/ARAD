/* eslint-disable prettier/prettier */
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../../utils/common/order.enum';

export class UpdateOrderStatus {
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED,OrderStatus.DELIVERED])
  status!: OrderStatus;
}
