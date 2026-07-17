// src/products/dto/create-product.dto.ts

import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
// 1. Add "Transform" to your class-transformer imports
import { Type, Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  description!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock!: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  categoryId!: number;

  // 2. 👇 NEW: Discount Percentage (e.g., 10 for 10% off)
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  discount?: number;

  // 3. 👇 NEW: Discount Start Date
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  discountStartDate?: Date;

  // 4. 👇 NEW: Discount End Date
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  discountEndDate?: Date;

  // 5. 👇 NEW: Active Status (converts "true"/"false" strings safely to boolean)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1 || value === '1') return true;
    if (value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}