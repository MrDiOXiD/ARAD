import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ example: 42, description: 'ID of the order to pay for' })
  @IsInt()
  @IsPositive()
  orderId!: number;
}
