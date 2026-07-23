import { IsInt, IsString, Min, Max, IsNotEmpty, IsOptional } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment!: string;
}
