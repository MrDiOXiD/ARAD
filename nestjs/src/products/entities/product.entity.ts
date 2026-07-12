
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoriesEntity } from '../../categories/entities/category.entity';
import { OrderProductsEntity } from '../../orders/entities/order-product.entity';

@Entity({ name: 'Product' })
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
  @CreateDateColumn()
  createdAt!: Timestamp;
  @UpdateDateColumn()
  updatedAt!: Timestamp;
  @Column({ default: 2 })
  userId!: number;
@Column({ nullable: true })
categoryId!: number | null;
  @ManyToOne(() => UserEntity, (user) => user.products)
  createdBy!: UserEntity;
  @ManyToOne(() => CategoriesEntity, (cat) => cat.products)
  category!: CategoriesEntity;
  @OneToMany(() => OrderProductsEntity, (op) => op.product)
  products!: OrderProductsEntity[];
}
