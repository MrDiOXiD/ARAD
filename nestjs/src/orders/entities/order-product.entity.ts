/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "@/products/entities/product.entity";

@Entity({ name: 'orders-product' })
export class OrderProductsEntity {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    order_quantity!: number;
    @ManyToOne(() => OrderEntity, (order) => order.products)
    order!: OrderEntity;
    @ManyToOne(() => ProductEntity, (prod) => prod.id, { cascade: true })
    product!: ProductEntity;
}
