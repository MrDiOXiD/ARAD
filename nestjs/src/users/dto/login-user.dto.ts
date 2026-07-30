import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The registered email address of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @ApiProperty({
    description: 'The user password. Must contain at least one letter and one number.',
    example: 'StrongP@ssw0rd1', // Example passes your regex and length constraints
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(72, { message: 'Password must not exceed 72 characters' }) // bcrypt hard limit
  // Enforce at least one letter and one digit — matches OWASP basic complexity
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password!: string;

  @ApiProperty({
    description: 'Valid Iranian mobile phone number',
    example: '09123456789',
  })
  @IsString()
  @IsNotEmpty() // Note: Change to @IsOptional() if users can login with EITHER email or phone, rather than requiring both
  @Matches(/^(?:0|\+98|0098)9\d{9}$/, {
    message: 'Phone number must be a valid Iranian mobile number (e.g., 09123456789, +989123456789, or 00989123456789)',
  })
  phoneNumber!: string;
}