import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItemEntity } from './entities/wishlist-item.entity';
import { WishlistService } from './services/wishlist.service';
import { WishlistController } from './controllers/wishlist.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishlistItemEntity]),
    // If AuthenticationGuard needs JwtService/ConfigService and those
    // aren't provided by a global module already in your app, add
    // them here — same config as UsersModule's JwtModule.registerAsync.
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
