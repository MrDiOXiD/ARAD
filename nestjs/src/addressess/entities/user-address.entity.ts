import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity({ name: 'user_addresses' })
export class UserAddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /** Free-text tag shown on the checkout cards, e.g. "منزل" / "محل کار". */
  @Column({ length: 30 })
  tag!: string;

  @Column()
  name!: string;

  @Column({ length: 15 })
  phone!: string;

  @Column()
  city!: string;

  @Column({ type: 'text' })
  addressLine!: string;

  @Column({ length: 10 })
  postalCode!: string;

  /** At most one address per user should have this set to true — enforced in the service layer, see setDefault(). */
  @Column({ default: false })
  isDefault!: boolean;

  @Index()
  @ManyToOne(() => UserEntity, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
