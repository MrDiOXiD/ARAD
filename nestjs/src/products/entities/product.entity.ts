import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategoriesEntity } from '../../categories/entities/category.entity';
import { OrderProductsEntity } from '../../orders/entities/order-product.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { ReviewEntity } from '@/reviews/entities/review.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column()
  stock!: number;

// 1. Add ! here since we have a default value of 0 in Postgres
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount!: number; 

  // 2. Add ! and declare it can be Date or null (since nullable: true)
  @Column({ type: 'timestamp', nullable: true })
  discountStartDate!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  discountEndDate!: Date | null;

  // 3. Add ! here since we have a default value of true
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
  
  //adding required parameters in front
  @Column({ type: 'varchar', length: 100, nullable: true })
  brand!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  badge!: string | null;

  // 🌟 The dynamic key-value store for frontend specs
  @Column({ type: 'jsonb', nullable: true })
  attributes!: Record<string, string | number | boolean> | null;

  @Column({ nullable: true })
  productImage!: string;

  @Column({ type: 'jsonb', nullable: true })
  gallery!: { secure_url: string; public_id: string }[];

  @Column({ nullable: true })
  imagePublicId!: string;

  @Column({ default: 0 })
  userId!: number;

  @Column({ nullable: true })
  categoryId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;   // Timestamp is a DB type, not a TS type — use Date

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.products)
  createdBy!: UserEntity;

  @ManyToOne(() => CategoriesEntity, (cat) => cat.products)
  category!: CategoriesEntity;

  @OneToMany(() => OrderProductsEntity, (op) => op.product)
  orderProducts!: OrderProductsEntity[]; // was 'products' — renamed to avoid collision with entity class name
  @OneToMany(() => ReviewEntity, (review) => review.product)
  reviews!: ReviewEntity[];
}
