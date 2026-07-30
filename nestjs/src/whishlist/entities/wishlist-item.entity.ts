import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';
import { ProductEntity } from '@/products/entities/product.entity';

@Entity({ name: 'wishlist_items' })
@Unique(['userId', 'productId']) // Prevents adding the same product twice to the same user's wishlist
export class WishlistItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  userId!: UserEntity;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  productId!: ProductEntity;

  @CreateDateColumn()
  createdAt!: Date;

@ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

}
