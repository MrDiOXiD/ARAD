import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MinLength(4)
  title!: string;

@ApiProperty({ example: 'Active', required: false }) // Shows it in Swagger
  @IsString()
  description!: string;
}
