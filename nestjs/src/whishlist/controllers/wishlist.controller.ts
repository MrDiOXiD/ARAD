import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiOkResponse, 
  ApiOperation, 
  ApiParam, 
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { WishlistService } from '../services/wishlist.service';
import { CurrentUser } from '../../utils/decorators/currentUser.decorator';
import { AuthenticationGuard } from '../../utils/guard/auth.guard';
import { UserEntity } from '@/users/entities/user.entity';
import { WishlistItemResponseDto, WishlistRemovedResponseDto } from '../dto/wishlist-responses.dto';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized. Missing or invalid JWT token.' })
@Controller('user/wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "List the current user's wishlist" })
  @ApiOkResponse({ 
    description: 'Successfully retrieved wishlist.',
    type: [WishlistItemResponseDto] // 👈 Tells Swagger this returns an array of items
  })
  async findAll(@CurrentUser() user: UserEntity) {
    return this.wishlistService.findAllForUser(user.id);
  }

  @Get('ids')
  @ApiOperation({ 
    summary: "Get just the product ids in the current user's wishlist",
    description: 'Lightweight endpoint — just ids, for hydrating heart-icon state on product listing/card grids.' 
  })
  @ApiOkResponse({ 
    description: 'Successfully retrieved favorited product ids.',
    type: [Number], // 👈 Tells Swagger this returns an array of numbers
    schema: { example: [105, 203, 44] } // Provides a clean example in the UI
  })
  async findAllIds(@CurrentUser() user: UserEntity) {
    return this.wishlistService.findProductIdsForUser(user.id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add a product to the current user\'s wishlist' })
  @ApiParam({ name: 'productId', type: 'integer', example: 105, description: 'The ID of the product to favorite' })
  @ApiOkResponse({ 
    description: 'Successfully added (or safely returned existing if already present).',
    type: WishlistItemResponseDto 
  })
  @ApiBadRequestResponse({ description: 'Invalid productId provided (must be an integer).' })
  async add(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: UserEntity,
  ) {
    return this.wishlistService.add(user.id, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove a product from the current user\'s wishlist' })
  @ApiParam({ name: 'productId', type: 'integer', example: 105, description: 'The ID of the product to unfavorite' })
  @ApiOkResponse({ 
    description: 'Successfully removed (or safely ignored if already absent).',
    type: WishlistRemovedResponseDto
  })
  @ApiBadRequestResponse({ description: 'Invalid productId provided (must be an integer).' })
  async remove(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: UserEntity,
  ) {
    await this.wishlistService.remove(user.id, productId);
    return { removed: true };
  }
}