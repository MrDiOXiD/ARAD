import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CategoriesEntity } from '../../categories/entities/category.entity';
import { OrderProductsEntity } from '../../orders/entities/order-product.entity';
import { UserEntity } from '@/users/entities/user.entity';
import { ReviewEntity } from '@/reviews/entities/review.entity';
import { ProductBadge } from '../enums/product-badge.enum';

// @Index doesn't support per-column ASC/DESC — the migration recreates this
// as ascending. Postgres B-tree indexes scan backwards for free, so
// ORDER BY isFeatured DESC, createdAt DESC still uses it efficiently.
@Index('IDX_products_isFeatured_createdAt', ['isFeatured', 'createdAt'])
@Entity({ name: 'products' })
export class ProductEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'لامپ LED حبابی ۹ وات' })
  @Column()
  title!: string;

  @ApiProperty({ example: 'لامپ کم مصرف با طول عمر بالا' })
  @Column()
  description!: string;

  // TypeORM returns 'decimal' columns as strings — documented as such so
  // Swagger/clients don't assume a JS number and lose precision.
  @ApiProperty({ example: '45000.00', description: 'Returned as a string — TypeORM does not cast decimal columns to number' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @ApiProperty({ example: 100 })
  @Column()
  stock!: number;

  @ApiProperty({ example: '22.00', description: 'Percentage discount, returned as a string' })
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount!: number;

  @ApiPropertyOptional({ example: '2026-09-01T00:00:00.000Z', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  discountStartDate!: Date | null;

  @ApiPropertyOptional({ example: '2026-09-30T00:00:00.000Z', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  discountEndDate!: Date | null;

  @ApiProperty({ example: true, default: true })
  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  // Admin-controlled "featured" flag — drives sort=featured on GET /products
  @ApiProperty({ example: false, default: false, description: "Drives sort=featured on GET /products" })
  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @ApiPropertyOptional({ example: 'پارس شهاب', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  brand!: string | null;

  @ApiPropertyOptional({
    example: ['new', 'hot'],
    enum: ProductBadge,
    isArray: true,
    nullable: true,
    description: 'A product can carry multiple badges at once (e.g. new + hot).',
  })
  @Column({ type: 'enum', enum: ProductBadge, array: true, nullable: true })
  badges!: ProductBadge[] | null;

  @ApiPropertyOptional({
    example: { color: 'white', power: '9W', warranty: '12 months' },
    nullable: true,
    description: 'Dynamic key-value specs',
  })
  @Column({ type: 'jsonb', nullable: true })
  attributes!: Record<string, string | number | boolean> | null;

  @ApiPropertyOptional({ example: 'https://bucket.example.com/products/167-abc.jpg' })
  @Column({ nullable: true })
  productImage!: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'object', properties: { secure_url: { type: 'string' }, public_id: { type: 'string' } } },
  })
  @Column({ type: 'jsonb', nullable: true })
  gallery!: { secure_url: string; public_id: string }[];

  @ApiPropertyOptional({ example: 'products/167-abc.jpg' })
  @Column({ nullable: true })
  imagePublicId!: string;

  @ApiProperty({ example: 1, default: 0 })
  @Column({ default: 0 })
  userId!: number;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @Column({ nullable: true })
  categoryId!: number | null;

  @ApiProperty({ example: '2026-09-11T12:00:00.000Z' })
  @CreateDateColumn()
  createdAt!: Date;   // Timestamp is a DB type, not a TS type — use Date

  @ApiProperty({ example: '2026-09-11T12:00:00.000Z' })
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
