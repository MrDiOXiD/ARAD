/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../../utils/common/order.enum';

export class UpdateOrderStatus {
  @ApiProperty({
    description: 'New status to transition the order to. Only forward transitions to SHIPPED or DELIVERED are allowed here.',
    enum: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
    example: OrderStatus.SHIPPED,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
  status!: OrderStatus;
}
