import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItemEntity } from '../entities/wishlist-item.entity';
import { WishlistItemResponseDto } from '../dto/wishlist-responses.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItemEntity)
    private readonly wishlistRepository: Repository<WishlistItemEntity>,
  ) {}

  async findAllForUser(userId: number): Promise<WishlistItemResponseDto[]> {
    const rows = await this.wishlistRepository.find({
      where: { userId: { id: userId } },
      // Fixed: was relations: ['product'] — that relation doesn't
      // exist on this entity, it's named `productId`. This was
      // silently failing to join, which is why the dashboard grid had
      // no product details to render.
      relations: ['productId'],
      order: { createdAt: 'DESC' },
    });

    return rows.map((row) => this.toResponseDto(row));
  }

  async findProductIdsForUser(userId: number): Promise<number[]> {
    const rows = await this.wishlistRepository.find({
      where: { userId: { id: userId } },
      relations: ['productId'], // was ['product'] — same fix as above
    });

    return rows.map((row) => row.productId.id);
  }

  async add(userId: number, productId: number): Promise<WishlistItemResponseDto> {
    let saved: WishlistItemEntity;

    try {
      const newItem = this.wishlistRepository.create({
        userId: { id: userId } as any,
        productId: { id: productId } as any,
      });
      saved = await this.wishlistRepository.save(newItem);
    } catch (error: unknown) {
      const pgCode =
        (error as { code?: string })?.code ||
        (error as { driverError?: { code?: string } })?.driverError?.code;

      if (pgCode === '23505') {
        const existing = await this.wishlistRepository.findOne({
          where: { userId: { id: userId }, productId: { id: productId } },
          relations: ['productId'],
        });
        if (existing) return this.toResponseDto(existing);
      }
      throw error;
    }

    // Re-fetch with the relation loaded so the response actually has
    // product details, not just a bare product id — save() doesn't
    // hydrate relations on its returned entity by default.
    const withProduct = await this.wishlistRepository.findOne({
      where: { id: saved.id },
      relations: ['productId'],
    });
    return this.toResponseDto(withProduct!);
  }

  async remove(userId: number, productId: number): Promise<void> {
    await this.wishlistRepository.delete({
      userId: { id: userId } as any,
      productId: { id: productId } as any,
    });
  }

  /**
   * Maps the entity (with its awkwardly-named `userId`/`productId`
   * relation properties, which actually hold full related entities,
   * not numbers) onto what WishlistItemResponseDto actually promises:
   * flat productId number + a product summary for rendering, no
   * userId at all (the client never needs to see its own id echoed
   * back on every row).
   */
  private toResponseDto(row: WishlistItemEntity): WishlistItemResponseDto {
    return {
      id: row.id,
      productId: row.productId.id,
      product: {
        id: row.productId.id,
        title: (row.productId as any).title,
        price: (row.productId as any).price,
      },
      createdAt: row.createdAt,
    };
  }
}
