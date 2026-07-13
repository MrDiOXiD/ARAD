import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Roles } from '../../utils/common/Roles.enum';
import { OrderEntity } from '../../orders/entities/order.entity';
import { CategoriesEntity } from '../../categories/entities/category.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  roles!: Roles[];

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => ProductEntity, (product:ProductEntity) => product.createdBy)
  products!: ProductEntity[];

  // ERROR 1 FIX: category.entity.ts references user.category
  // Keep this name as 'category' to match the @ManyToOne inverse in CategoriesEntity
  @OneToMany(() => CategoriesEntity, (cat) => cat.createdBy)
  category!: CategoriesEntity[];

  // ERROR 2 FIX: order.entity.ts references user.orderUpdatedBy
  // Keep this name as 'orderUpdatedBy' to match the @ManyToOne inverse in OrderEntity
  @OneToMany(() => OrderEntity, (order) => order.updatedBy)
  orderUpdatedBy!: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders!: OrderEntity[];
}
