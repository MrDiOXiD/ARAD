import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItemEntity } from '../entities/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItemEntity)
    private readonly wishlistRepository: Repository<WishlistItemEntity>,
  ) {}

  async findAllForUser(userId: number): Promise<WishlistItemEntity[]> {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'], // Acceptable here since the frontend likely needs full product cards
      order: { createdAt: 'DESC' },
    });
  }

  /** Just the product ids — cheap payload for the "is this product favorited" check. */
  async findProductIdsForUser(userId: number): Promise<number[]> {
    const rows = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      // 🛡️ SECURITY & PERFORMANCE: Only pull the ID from the product table.
      // This prevents pulling massive amounts of unused product data into memory.
      select: { productId: { id: true } },
      relations: ['product'], 
    });
    
    return rows.map((row) => row.productId.id);
  }

  async add(userId: number, productId: number): Promise<WishlistItemEntity> {
    try {
      // 🛡️ TYPE SAFETY: Native TypeORM relation assignment without using "as any"
      const newItem = this.wishlistRepository.create({
        userId: { id: userId },
        productId: { id: productId }, 
      });
      
      return await this.wishlistRepository.save(newItem);
    } catch (error: unknown) {
      // Postgres unique_violation — same product favorited twice.
      // Safely check for the error code whether it's direct or wrapped by TypeORM's driver
      const pgCode = 
        (error as { code?: string })?.code || 
        (error as { driverError?: { code?: string } })?.driverError?.code;

      if (pgCode === '23505') {
        const existing = await this.wishlistRepository.findOne({
          where: { userId: { id: userId }, productId: { id: productId } },
        });
        
        // Idempotent success: return the existing record instead of throwing a 409
        if (existing) return existing;
      }
      
      throw error;
    }
  }

  async remove(userId: number, productId: number): Promise<void> {
    // Removing something already absent is a no-op success, not a 404
    // — same idempotency reasoning as add() above.
    await this.wishlistRepository.delete({
      userId: { id: userId },
      productId: { id: productId },
    });
  }
}