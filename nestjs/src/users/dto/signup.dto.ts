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
}