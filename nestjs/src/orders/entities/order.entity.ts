import { UserEntity } from '@/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ShippingEntity } from "./shipping.entity";
import { OrderProductsEntity } from "./order-product.entity";
import { OrderStatus } from "../../utils/common/order.enum";

@Entity({ name: "order" })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @CreateDateColumn()
  orderAt!: Date;
  @Column({ type: "timestamp", nullable: true })
  shippedAt!: Date | null;
  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PROCESSING })
  status!: string;
  @Column({ type: "decimal", precision: 10, default: 0, scale: 2 })
  total_price!: number;
  @ManyToOne(() => UserEntity, (user) => user.orderUpdatedBy)
  updatedBy!: UserEntity;
  @OneToOne(() => ShippingEntity, (shipping) => shipping.order, {
    cascade: true,
  })
  @JoinColumn()
  shippingAddress!: ShippingEntity;
  @OneToMany(() => OrderProductsEntity, (ord) => ord.order, { cascade: true })
  products!: OrderProductsEntity[];
  @ManyToOne(() => UserEntity, (user) => user.orders)
  user!: UserEntity;
}
