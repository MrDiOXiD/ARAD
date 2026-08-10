/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize, IsArray, IsOptional, IsInt, IsIn, IsDateString } from 'class-validator';
import { CreateShippingDto } from './shipping.dto';
import { OrderProductDto } from './order-product.dto';

export class CreateOrderDto {
  @ApiPropertyOptional({ description: 'One-off address, if not using a saved one', type: CreateShippingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateShippingDto)
  shippingAddress!: CreateShippingDto;

  @ApiPropertyOptional({ description: 'Use one of the user\'s saved addresses' })
  @IsOptional()
  @IsInt()
  addressId?: number;


  @ApiProperty({ example: 3, description: 'Selected delivery method id' })
@IsInt()
deliveryMethodId!: number;

@ApiProperty({ example: '2026-08-15', description: 'Requested delivery date, YYYY-MM-DD' })
@IsDateString()
requestedDeliveryDate!: string;

@ApiProperty({ enum: ['online', 'cod'] })
@IsIn(['online', 'cod'])
paymentMethod!: 'online' | 'cod';


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
