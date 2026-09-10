import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class SignupDto extends LoginUserDto {
  @ApiProperty({
    description: 'A unique public display name for the user',
    example: 'johndoe99',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  username!: string;

    @ApiProperty({
    description: 'A customers  name ',
    example: 'john',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(20, { message: 'name must not exceed 20 characters' })
  name!: string;

    @ApiProperty({
    description: 'A customers family name ',
    example: 'doe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'familyName must be at least 3 characters' })
  @MaxLength(20, { message: 'familyName must not exceed 20 characters' })
  familyName!: string;
}