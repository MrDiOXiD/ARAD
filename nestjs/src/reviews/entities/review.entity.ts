// src/reviews/entities/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  rating!: number; // 1 to 5

  @Column({ type: 'text' })
  comment!: string;

  @Column({ default: false })
  isApproved!: boolean; // Moderation flag

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user!: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.reviews)
  product!: ProductEntity;

  @CreateDateColumn()
  createdAt!: Date;
}