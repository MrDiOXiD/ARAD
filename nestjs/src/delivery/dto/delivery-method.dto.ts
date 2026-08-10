import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryMethodDto {
  @ApiProperty({ example: 'ارسال با اسنپ پیک' })
  @IsNotEmpty()
  @IsString()
  label!: string;

  @ApiProperty({ enum: ['courier', 'pickup'] })
  @IsIn(['courier', 'pickup'])
  type!: 'courier' | 'pickup';

  @ApiProperty({ example: '65000', description: 'Flat base fee in Toman' })
  @IsNumberString()
  baseFee!: string;

  @ApiProperty({ example: '0', description: 'Additional fee per item quantity' })
  @IsNumberString()
  perItemFee!: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDeliveryMethodDto extends PartialType(CreateDeliveryMethodDto) {}

export class DeliveryMethodResponseDto {
  @ApiProperty() id!: number;
  @ApiProperty() label!: string;
  @ApiProperty({ enum: ['courier', 'pickup'] }) type!: 'courier' | 'pickup';
  @ApiProperty() baseFee!: string;
  @ApiProperty() perItemFee!: string;
  @ApiProperty() isActive!: boolean;
}
