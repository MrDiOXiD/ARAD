import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../enums/payment-status.enum';
import { UserEntity } from '@/users/entities/user.entity';
import { OrderEntity } from '@/orders/entities/order.entity';

@Entity({ name: 'payments' })
export class PaymentEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: '1533727744287', description: 'Zibal transaction ID — authoritative reference' })
  @Index({ unique: true })
  @Column({ unique: true })
  trackId!: string;

  @ApiProperty({ example: 130000, description: 'Amount in Tomans — stored from order total, never from client' })
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount!: number;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.VERIFIED })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @ApiPropertyOptional({ example: 100, description: 'Zibal result code from /v1/verify (100 = success)' })
  @Column({ type: 'int', nullable: true })
  zibalResultCode!: number | null;

  @ApiPropertyOptional({ example: '2026-07-24T10:30:00.000Z', description: 'Timestamp from Zibal verify response' })
  @Column({ type: 'timestamp', nullable: true })
  paidAt!: Date | null;

  @ApiPropertyOptional({ example: '185.231.10.1', description: 'Client IP at checkout initiation' })
  @Column({ type: 'varchar', length: 45, nullable: true })
  clientIp!: string | null;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'RESTRICT' })
  user!: UserEntity;

  @ApiProperty({ type: () => OrderEntity })
  @ManyToOne(() => OrderEntity, { nullable: false, onDelete: 'RESTRICT' })
  order!: OrderEntity;

  @ApiProperty({ example: '2026-07-24T10:29:00.000Z' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-24T10:30:00.000Z' })
  @UpdateDateColumn()
  updatedAt!: Date;
}
