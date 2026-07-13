import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class SignupDto extends LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  username!: string;
}
