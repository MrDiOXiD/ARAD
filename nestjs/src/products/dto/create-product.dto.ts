// src/products/dto/create-product.dto.ts

import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
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
import { ProductBadge } from '../enums/product-badge.enum';

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

  // Admin-controlled — surfaces the product under sort=featured
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1 || value === '1') return true;
    if (value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  brand?: string;

  // 🌟 Multiple badges at once (e.g. ["new","hot"]) — arrives as a JSON string
  // from multipart/form-data, same convention as `attributes` below.
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value; // let @IsArray throw a clear validation error
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMaxSize(6)
  @IsEnum(ProductBadge, { each: true, message: `Each badge must be one of: ${Object.values(ProductBadge).join(', ')}` })
  badges?: ProductBadge[];

  // 🌟 The parsing magic for multipart/form-data
  @IsOptional()
  @Transform(({ value }) => {
    // If it arrives as a string from FormData, parse it into an object
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        return JSON.parse(value);
      } catch (error) {
        return value; // If parsing fails, pass the string so @IsObject can throw an error
      }
    }
    return value;
  })
  @IsObject({ message: 'Attributes must be a valid JSON object' })
  attributes?: Record<string, any>;
}