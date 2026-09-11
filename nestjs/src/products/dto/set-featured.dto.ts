import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetFeaturedDto {
  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isFeatured!: boolean;
}
