import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type OtpPurpose = 'signup' | 'login';

@Entity({ name: 'otp_codes' })
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  phoneNumber!: string;

  @Column({ type: 'varchar', length: 10 })
  purpose!: OtpPurpose;

  /** SHA-256 hash of the 6-digit code — never store the plaintext code. */
  @Column()
  codeHash!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ default: false })
  consumed!: boolean;

  /** Failed verify attempts against THIS code — locked out after MAX_ATTEMPTS regardless of expiry. */
  @Column({ default: 0 })
  attempts!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
