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

  @Column({ nullable: true })
  productImage!: string;

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
}
