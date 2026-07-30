import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddWishlistItemDto {
  @ApiProperty({
    description: 'The ID of the product being added to the wishlist',
    example: 42,
  })
  @IsNumber()
  @IsNotEmpty()
  productId!: number;
}

// Interfaces can go in a separate file like wishlist.interface.ts, 
// or be exported from the DTO file for simplicity.
export interface WishlistItemResponse {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
}