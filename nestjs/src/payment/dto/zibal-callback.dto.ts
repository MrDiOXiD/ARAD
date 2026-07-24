import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsIn, IsOptional, Length } from 'class-validator';

export class ZibalCallbackDto {
  @ApiProperty({ example: '1533727744287', description: 'Zibal transaction ID' })
  @IsNumberString()
  @Length(1, 30)
  trackId!: string;

  @ApiProperty({ example: '1', enum: ['0', '1'], description: '1 = user completed UI flow, 0 = cancelled' })
  @IsIn(['0', '1'])
  success!: string;

  @ApiPropertyOptional({ example: '1', description: 'Zibal status code — informational only' })
  @IsNumberString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: '42', description: 'orderId echoed back by Zibal' })
  @IsNumberString()
  @IsOptional()
  orderId?: string;
}
