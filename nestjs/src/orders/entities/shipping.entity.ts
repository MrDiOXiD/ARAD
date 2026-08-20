/* eslint-disable prettier/prettier */
// shipping.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { OrderEntity } from "./order.entity";
import { UserAddressEntity } from "@/addressess/entities/user-address.entity";

@Entity({ name: "shipping" })
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  phone!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column({ length: 10 })
  postalCode!: string;

  @ManyToOne(() => UserAddressEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  sourceAddress?: UserAddressEntity;

  @Column()
  city!: string;
@OneToOne(() => OrderEntity, (order) => order.shippingAddress)
order!: OrderEntity; // @JoinColumn() removed — OrderEntity.shippingAddress already owns the FK
}
