import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemResponseDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the wishlist record' })
  id!: number;

  @ApiProperty({ example: 42, description: 'The ID of the user who owns this wishlist item' })
  userId!: number;

  @ApiProperty({ example: 105, description: 'The ID of the favorited product' })
  productId!: number;

  @ApiProperty({ 
    example: '2026-07-30T02:53:44.000Z', 
    description: 'When the product was added to the wishlist' 
  })
  createdAt!: Date;
}

export class WishlistRemovedResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the removal was successful' })
  removed!: boolean;
}