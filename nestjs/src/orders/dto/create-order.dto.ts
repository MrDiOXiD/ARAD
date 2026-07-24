/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { CreateShippingDto } from './shipping.dto';
import { OrderProductDto } from './order-product.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Delivery / shipping address for this order',
    type: CreateShippingDto,
  })
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress!: CreateShippingDto;

  @ApiProperty({
    description: 'List of products included in the order',
    type: [OrderProductDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderProductDto)
  @ValidateNested({ each: true })
  orderProducts!: OrderProductDto[];
}
