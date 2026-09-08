import { Injectable, InternalServerErrorException, Logger, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('KAVENEGAR_API_KEY');
    if (!apiKey) throw new InternalServerErrorException('KAVENEGAR_API_KEY env var is missing');
    this.apiKey = apiKey;
    this.baseUrl = `https://api.kavenegar.com/v1/${apiKey}`;
  }

  /**
   * Sends the OTP code via Kavenegar's Verify Lookup API (purpose-built
   * for OTP/verification SMS — better delivery rates than a generic
   * SMS send, and Kavenegar's own dashboard can rate-limit/monitor
   * this endpoint separately from marketing sends).
   *
   * NEVER log the actual code here — this method's arguments must
   * never appear in application logs.
   */
  async sendOtp(phoneNumber: string, code: string): Promise<void> {
    try {
      const url = new URL(`${this.baseUrl}/verify/lookup.json`);
      url.searchParams.set('receptor', phoneNumber);
      url.searchParams.set('token', code);
      url.searchParams.set('template', 'otp-verify'); // must match a template configured in your Kavenegar panel

      const res = await fetch(url.toString(), { method: 'GET', signal: AbortSignal.timeout(10_000) });
      const data = await res.json();

      if (!res.ok || data?.return?.status !== 200) {
        this.logger.warn(`Kavenegar send failed: status=${data?.return?.status} message=${data?.return?.message}`);
        throw new BadGatewayException('Failed to send verification code — please try again.');
      }
    } catch (err) {
      if (err instanceof BadGatewayException) throw err;
      this.logger.error(`Kavenegar network error: ${(err as Error).message}`);
      throw new BadGatewayException('SMS gateway unreachable — please try again.');
    }
  }
}
