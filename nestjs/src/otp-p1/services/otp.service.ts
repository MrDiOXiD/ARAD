import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { randomInt, createHash } from 'crypto';
import { OtpEntity, OtpPurpose } from '../entities/otp.entity';
import { KavenegarService } from './kavenegar.service';

const CODE_LENGTH = 6;
const CODE_TTL_MS = 2 * 60 * 1000; // 2 minutes — short enough to limit brute-force window
const MAX_VERIFY_ATTEMPTS = 5; // per code, not per phone — see verify()
const MAX_REQUESTS_PER_WINDOW = 3;
const REQUEST_WINDOW_MS = 15 * 60 * 1000; // 3 codes per 15 min per phone number

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepo: Repository<OtpEntity>,
    private readonly kavenegar: KavenegarService,
  ) {}

  private hashCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }

  /**
   * Sends a new OTP. Rate-limited per phone number to stop SMS-bombing
   * (each send costs money and can be used to harass a real phone
   * number) and to slow down enumeration/brute-force attempts.
   */
  async requestOtp(phoneNumber: string, purpose: OtpPurpose): Promise<void> {
    const windowStart = new Date(Date.now() - REQUEST_WINDOW_MS);
    const recentCount = await this.otpRepo.count({
      where: { phoneNumber, purpose, createdAt: MoreThan(windowStart) },
    });
    if (recentCount >= MAX_REQUESTS_PER_WINDOW) {
      throw new HttpException(
        'Too many code requests — please wait before trying again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Cryptographically secure — Math.random() is NOT safe for this,
    // it's predictable and has been exploited for OTP prediction before.
    const code = randomInt(0, 10 ** CODE_LENGTH).toString().padStart(CODE_LENGTH, '0');

    await this.otpRepo.save(
      this.otpRepo.create({
        phoneNumber,
        purpose,
        codeHash: this.hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        consumed: false,
        attempts: 0,
      }),
    );

    await this.kavenegar.sendOtp(phoneNumber, code);
    // Never log `code` anywhere past this point.
  }

  /**
   * Verifies a code. One-time use (marks consumed on success), locked
   * out after MAX_VERIFY_ATTEMPTS wrong guesses on this specific code
   * even if the correct code is guessed afterward — forces requesting
   * a fresh one instead of allowing unlimited retries against one code.
   */
  async verifyOtp(phoneNumber: string, code: string, purpose: OtpPurpose): Promise<void> {
    const otp = await this.otpRepo.findOne({
      where: { phoneNumber, purpose, consumed: false },
      order: { createdAt: 'DESC' },
    });

    // Same generic message whether no code was ever requested, it
    // expired, or the guess was wrong — never reveal which, that
    // distinction is exactly what helps an attacker narrow things down.
    const genericError = new BadRequestException('Invalid or expired code.');

    if (!otp) throw genericError;
    if (otp.expiresAt.getTime() < Date.now()) throw genericError;
    if (otp.attempts >= MAX_VERIFY_ATTEMPTS) throw genericError;

    if (otp.codeHash !== this.hashCode(code)) {
      otp.attempts += 1;
      await this.otpRepo.save(otp);
      throw genericError;
    }

    otp.consumed = true;
    await this.otpRepo.save(otp);
  }
}
