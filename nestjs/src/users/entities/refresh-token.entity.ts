import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * SHA-256 hash of the raw token — the raw value only ever exists in
   * the httpOnly cookie and briefly in memory server-side. If this
   * table were ever read (backup leak, SQL injection elsewhere, a
   * curious DBA), a hash is useless to an attacker; a stored raw
   * token would let them impersonate every user who has one.
   */
  @Index({ unique: true })
  @Column()
  tokenHash!: string;

  /**
   * Shared across every token produced by rotating from the same
   * original login. Lets us revoke an entire chain at once when we
   * detect a revoked token being reused (see refreshAccessToken) —
   * the standard signal that a refresh token was stolen and both the
   * attacker and the legitimate user are now racing to use it.
   */
  @Index()
  @Column()
  familyId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: UserEntity;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ default: false })
  revoked!: boolean;

  @Column({ nullable: true })
  createdByIp?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
