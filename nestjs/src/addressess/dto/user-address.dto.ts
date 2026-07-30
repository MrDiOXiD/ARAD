import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ description: 'Short label shown on address cards', example: 'محل کار', maxLength: 30 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  tag!: string;

  @ApiProperty({ example: 'حسام محمدی' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: '09131234567' })
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, { message: 'phone must be a valid Iranian mobile number' })
  phone!: string;

  @ApiProperty({ example: 'Tehran' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ example: 'میدان ونک، خیابان ملاصدرا، پلاک ۱۰، واحد ۲' })
  @IsNotEmpty()
  @IsString()
  addressLine!: string;

  @ApiProperty({ example: '1967834511' })
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'postalCode must be exactly 10 digits' })
  postalCode!: string;

  @ApiProperty({ description: 'Set as the default address for checkout', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}
