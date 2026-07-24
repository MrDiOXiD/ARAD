import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length } from 'class-validator';

export class VerifyDto {
  // Zibal trackId is a numeric string (e.g. "1533727744287")
  // IsNumberString rejects alpha characters; Length prevents oversized inputs
  @ApiProperty({ example: '1533727744287' })
  @IsNumberString()
  @Length(1, 30)
  trackId!: string;
}
