import { ApiProperty } from '@nestjs/swagger';

export class OrderSummaryProductDto {
  @ApiProperty() title!: string;
  @ApiProperty() quantity!: number;
  @ApiProperty({ description: 'Unit price, in Toman' }) price!: number;
}

export class OrderSummaryResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty({ enum: ['processing', 'shipped', 'delivered', 'cancelled'] }) status!: string;
  @ApiProperty({ enum: ['online', 'cod'] }) paymentMethod!: string;
  @ApiProperty({ nullable: true }) paidAt!: Date | null;
  @ApiProperty() orderAt!: Date;
  @ApiProperty({ type: [OrderSummaryProductDto] }) products!: OrderSummaryProductDto[];
  @ApiProperty() subtotal!: number;
  @ApiProperty() deliveryFee!: number;
  @ApiProperty() total!: number;
}