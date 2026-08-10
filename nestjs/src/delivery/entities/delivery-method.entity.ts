import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type DeliveryMethodType = 'courier' | 'pickup';

@Entity({ name: 'delivery_methods' })
export class DeliveryMethodEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string; // e.g. "ارسال با اسنپ پیک", "تحویل حضوری در فروشگاه"

  @Column({ type: 'varchar', length: 20 })
  type!: DeliveryMethodType;

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  baseFee!: string; // numeric column → string from pg, same as product.price elsewhere

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  perItemFee!: string; // added per unit quantity in the order

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
