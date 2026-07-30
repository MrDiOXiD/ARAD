import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './controllers/wishlist.controller';
import { WishlistService } from './services/wishlist.service';
import { WishlistItemEntity } from './entities/wishlist-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistItemEntity]),
    // We do NOT import UsersModule here to maintain a clean boundary.
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService], // Export if other modules (like Analytics) need to query wishlist counts
})
export class WishlistModule {}