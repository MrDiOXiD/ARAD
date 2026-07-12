/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderEntity } from '../../orders/entities/order.entity';
import { CategoriesEntity } from '../../categories/entities/category.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { Roles } from '../../utils/common/Roles.enum';

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
  createdAt!: Timestamp;
  products!: ProductEntity[];
  @OneToMany(() => CategoriesEntity, (cat) => cat.createdBy)
  category!: CategoriesEntity[];
  @OneToMany(() => OrderEntity, (order) => order.updatedBy)
  orderUpdatedBy!: OrderEntity;
  @OneToMany(() => OrderEntity, (order) => order.user)
  orders!: OrderEntity[];
}
