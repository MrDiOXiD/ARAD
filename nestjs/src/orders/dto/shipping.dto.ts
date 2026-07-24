/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @ApiProperty({
    description: 'Recipient phone number for delivery contact',
    example: '+989131234567',
  })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional({
    description: 'Recipient full name',
    example: 'Hesam Mohammadi',
  })
  @IsOptional()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Full street address, including street name and unit number',
    example: 'Vali Asr St, No. 24, Unit 3',
  })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({
    description: 'City the order will be shipped to',
    example: 'Tehran',
  })
  @IsNotEmpty()
  @IsString()
  city!: string;
}
