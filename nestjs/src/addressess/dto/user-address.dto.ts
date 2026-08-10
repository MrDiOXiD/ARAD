import { ApiProperty, PartialType } from "@nestjs/swagger";
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";
import { AddressIconType } from "../entities/user-address.entity";

export class CreateUserAddressDto {
  @ApiProperty({
    description: "Short label shown on address cards",
    example: "محل کار",
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  tag!: string;

@ApiProperty({
    description: "Icon category shown on the address card",
    enum: ["home", "office", "warehouse"],
    example: "home",       // added
    default: "home",
    required: false,
  })
  @IsOptional()
  @IsIn(["home", "office", "warehouse"])
  icon?: AddressIconType;
 

  @ApiProperty({ example: "حسام محمدی" })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: "09131234567" })
  @IsNotEmpty()
  @Matches(/^09\d{9}$/, { message: "phone must be a valid Iranian mobile number" })
  phone!: string;

  @ApiProperty({ example: "Tehran" })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ example: "تهران" })
  @IsNotEmpty()
  @IsString()
  province!: string;

  @ApiProperty({ example: "میدان ونک، خیابان ملاصدرا، پلاک ۱۰، واحد ۲" })
  @IsNotEmpty()
  @IsString()
  addressLine!: string;

  @ApiProperty({ example: "1967834511" })
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: "postalCode must be exactly 10 digits" })
  postalCode!: string;

  @ApiProperty({
    description: "Set as the default address for checkout",
    required: false,
    default: false,
  })

  @ApiProperty({
    description: "Set as the default address for checkout",
    example: false,         // added
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
 
}

export class UpdateUserAddressDto extends PartialType(CreateUserAddressDto) {}

export class UserAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the saved address' })
  id!: number;

  @ApiProperty({
    example: 'محل کار',
    description: 'Short label shown on the address card',
    maxLength: 30,
  })
  tag!: string;

  @ApiProperty({
    enum: ['home', 'office', 'warehouse'],
    example: 'home',
    description: 'Icon category shown on the address card',
  })
  icon!: AddressIconType;

  @ApiProperty({ example: 'حسام محمدی', description: 'Recipient name for this address' })
  name!: string;

  @ApiProperty({ example: '09131234567', description: 'Iranian mobile number, format 09XXXXXXXXX' })
  phone!: string;

  @ApiProperty({ example: 'تهران', description: 'Province' })
  province!: string;

  @ApiProperty({ example: 'Tehran', description: 'City' })
  city!: string;

  @ApiProperty({
    example: 'میدان ونک، خیابان ملاصدرا، پلاک ۱۰، واحد ۲',
    description: 'Street-level address',
  })
  addressLine!: string;

  @ApiProperty({ example: '1967834511', description: 'Iranian postal code, exactly 10 digits' })
  postalCode!: string;

  @ApiProperty({ example: false, description: 'Whether this is the default address for checkout' })
  isDefault!: boolean;

  @ApiProperty({
    example: '2026-08-06T11:40:36.557Z',
    type: String,
    format: 'date-time',
    description: 'When the address was first saved',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-08-06T11:40:36.557Z',
    type: String,
    format: 'date-time',
    description: 'When the address was last updated',
  })
  updatedAt!: Date;
}