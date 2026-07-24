import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class OrderProductDto {
  @ApiProperty({
    description: 'Quantity of the product being ordered (up to 2 decimal places)',
    example: 2,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  order_quantity!: number;

  @ApiProperty({
    description: 'ID of the product being ordered',
    example: 101,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  productId!: number;
}
