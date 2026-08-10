import { ApiProperty } from '@nestjs/swagger';

export class WishlistProductSummaryDto {
  @ApiProperty({ example: 105 })
  id!: number;

  @ApiProperty({ example: 'لامپ LED حبابی ۹ وات' })
  title!: string;

  @ApiProperty({ example: 219000 })
  price!: number;

  // Add image/thumbnail field here once confirmed against your actual
  // ProductEntity's field name (image? thumbnailUrl? icon?) — not
  // guessing at it without seeing that entity.
}

export class WishlistItemResponseDto {
  @ApiProperty({ example: 1, description: 'The unique ID of the wishlist record' })
  id!: number;

  @ApiProperty({ example: 105, description: 'The ID of the favorited product' })
  productId!: number;

  @ApiProperty({ type: WishlistProductSummaryDto })
  product!: WishlistProductSummaryDto;

  @ApiProperty({
    example: '2026-07-30T02:53:44.000Z',
    description: 'When the product was added to the wishlist',
  })
  createdAt!: Date;

  // Removed: userId. The client is always asking about its own
  // wishlist (scoped by the JWT via @CurrentUser()) — echoing its own
  // user id back on every single row was dead weight, not something
  // the frontend ever needs to read.
}

export class WishlistRemovedResponseDto {
  @ApiProperty({ example: true, description: 'Indicates if the removal was successful' })
  removed!: boolean;
}
