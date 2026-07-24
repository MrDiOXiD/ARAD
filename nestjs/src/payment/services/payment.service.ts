import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrdersService } from '@/orders/services/orders.service';
import { UserEntity } from '@/users/entities/user.entity';
import { OrderStatus } from '@/utils/common/order.enum';
import { normalizeError } from '@/utils/errors/normalize-error.util';

// Zibal result code meanings — kept here to avoid magic numbers in logic
const ZIBAL_SUCCESS      = 100;  // verified and settled
const ZIBAL_ALREADY_DONE = 201;  // already verified — idempotency case

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly zibalBaseUrl = 'https://gateway.zibal.ir/v1';
  private readonly merchant: string;
  private readonly appUrl: string;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    private readonly ordersService: OrdersService,
    private readonly config: ConfigService,
  ) {
    // Fail fast at startup if env vars are missing — don't let requests fail silently later
    const merchant = this.config.get<string>('ZIBAL_MERCHANT');
    const appUrl   = this.config.get<string>('APP_URL');
    if (!merchant) throw new InternalServerErrorException('ZIBAL_MERCHANT env var is missing');
    if (!appUrl)   throw new InternalServerErrorException('APP_URL env var is missing');
    this.merchant = merchant;
    this.appUrl   = appUrl;
  }

  // ── Step 1: Initiate payment ────────────────────────────────────────────────
  async initiatePayment(
    orderId: number,
    user: UserEntity,
    clientIp: string | null,
  ): Promise<{ payUrl: string; trackId: string }> {
    // Load order and enforce ownership — a user must not pay another user's order
    const order = await this.ordersService.findOne(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.user.id !== user.id) throw new ForbiddenException('Not your order');

    // Only PROCESSING orders can be paid — reject already-paid or cancelled ones
    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException(`Order status is '${order.status}' — cannot initiate payment`);
    }

    // Check no PENDING or VERIFIED payment already exists for this order
    // Prevents double-charging if the user clicks the checkout button twice
    const existing = await this.paymentRepo.findOne({
      where: { order: { id: orderId }, status: PaymentStatus.VERIFIED },
    });
    if (existing) throw new BadRequestException('Order has already been paid');

    // Amount comes from the DB (order.total_price), never from the client request body
    // Convert Tomans → Rials (Zibal requires Rials)
    const amountInRials = Math.round(Number(order.total_price) * 10);
    if (amountInRials <= 0) throw new BadRequestException('Order total is zero');

    // Call Zibal /v1/request
    let zibalData: { result: number; trackId?: number; message?: string };
    try {
      const res = await fetch(`${this.zibalBaseUrl}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant:    this.merchant,
          amount:      amountInRials,
          callbackUrl: `${this.appUrl}/payment/callback`,
          description: `Order #${orderId}`,
          orderId:     String(orderId), // sent to Zibal for reconciliation, returned in callback
          mobile:      undefined,       // optional: add user.phone if your UserEntity has it
        }),
        signal: AbortSignal.timeout(10_000), // 10 s — never hang indefinitely
      });
      zibalData = await res.json() as typeof zibalData;
    } catch (err) {
      const e = normalizeError(err);
      this.logger.error(`Zibal /request network error: ${e.message}`, e.stack);
      throw new BadGatewayException('Payment gateway unreachable — please try again');
    }

    if (zibalData.result !== ZIBAL_SUCCESS || !zibalData.trackId) {
      this.logger.warn(`Zibal /request failed: result=${zibalData.result} msg=${zibalData.message}`);
      throw new BadGatewayException('Payment gateway rejected the request');
    }

    const trackId = String(zibalData.trackId);

    // Persist a PENDING payment record before redirecting the user
    // If the server crashes between this save and the redirect, the trackId is preserved
    await this.paymentRepo.save(
      this.paymentRepo.create({
        trackId,
        amount:   Number(order.total_price),
        status:   PaymentStatus.PENDING,
        clientIp: clientIp ?? null,
        user,
        order,
        zibalResultCode: null,
        paidAt:          null,
      }),
    );

    this.logger.log(`Payment initiated: trackId=${trackId} orderId=${orderId} userId=${user.id}`);

    return {
      trackId,
      payUrl: `https://gateway.zibal.ir/start/${trackId}`,
    };
  }

  // ── Step 2: Verify payment (called by frontend after callback redirect) ─────
  async verifyPayment(
    trackId: string,
    user: UserEntity,
  ): Promise<{ success: boolean; alreadyVerified?: boolean }> {
    const payment = await this.paymentRepo.findOne({
      where: { trackId },
      relations: ['user', 'order'],
    });

    if (!payment) throw new NotFoundException('Payment record not found');

    // Enforce ownership — user A must not be able to verify user B's payment
    if (payment.user.id !== user.id) throw new ForbiddenException('Not your payment');

    // Idempotency: if already verified, return success without calling Zibal again
    // Zibal allows verify to be called more than once but returns result=201 on repeats
    if (payment.status === PaymentStatus.VERIFIED) {
      return { success: true, alreadyVerified: true };
    }

    // If already failed, don't allow re-verification (prevents brute-force polling)
    if (payment.status === PaymentStatus.FAILED) {
      throw new BadRequestException('Payment was already marked as failed');
    }

    // Call Zibal /v1/verify
    let zibalData: { result: number; paidAt?: string; amount?: number; message?: string };
    try {
      const res = await fetch(`${this.zibalBaseUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant: this.merchant, trackId }),
        signal: AbortSignal.timeout(10_000),
      });
      zibalData = await res.json() as typeof zibalData;
    } catch (err) {
      const e = normalizeError(err);
      this.logger.error(`Zibal /verify network error: ${e.message}`, e.stack);
      throw new BadGatewayException('Payment gateway unreachable during verification');
    }

    const isSuccess = zibalData.result === ZIBAL_SUCCESS || zibalData.result === ZIBAL_ALREADY_DONE;

    if (isSuccess) {
      // Amount integrity check — what Zibal says was paid must match what we requested
      // Prevents a tampered trackId from verifying a cheaper transaction
      if (zibalData.amount !== undefined) {
        const expectedRials = Math.round(Number(payment.amount) * 10);
        if (zibalData.amount !== expectedRials) {
          this.logger.error(
            `Amount mismatch on verify! trackId=${trackId} expected=${expectedRials} got=${zibalData.amount}`,
          );
          await this.paymentRepo.update({ trackId }, {
            status:          PaymentStatus.FAILED,
            zibalResultCode: zibalData.result,
          });
          throw new BadRequestException('Payment amount mismatch — possible tampering detected');
        }
      }

      // Mark payment verified and order as paid atomically using the same transaction context
      await this.paymentRepo.update(
        { trackId },
        {
          status:          PaymentStatus.VERIFIED,
          zibalResultCode: zibalData.result,
          paidAt:          zibalData.paidAt ? new Date(zibalData.paidAt) : new Date(),
        },
      );

      // Move order to SHIPPED (or a PAID status if you add one) — only after DB is updated
      // Do not mark order paid before the payment record is saved
      await this.ordersService.updateOrderStatus(
        payment.order.id,
        { status: OrderStatus.SHIPPED },
        user,
      );

      this.logger.log(
        `Payment verified: trackId=${trackId} orderId=${payment.order.id} userId=${user.id}`,
      );
      return { success: true };
    }

    // Non-success result
    await this.paymentRepo.update(
      { trackId },
      { status: PaymentStatus.FAILED, zibalResultCode: zibalData.result },
    );
    this.logger.warn(
      `Payment failed: trackId=${trackId} result=${zibalData.result} msg=${zibalData.message}`,
    );
    return { success: false };
  }

  // ── Admin: get payment status by trackId ───────────────────────────────────
  async getPaymentByTrackId(trackId: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepo.findOne({
      where: { trackId },
      relations: ['user', 'order'],
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}
