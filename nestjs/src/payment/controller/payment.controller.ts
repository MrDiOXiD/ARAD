import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { PaymentService } from '../services/payment.service';
import { CheckoutDto } from '../dto/checkout.dto';
import { VerifyDto } from '../dto/verify.dto';
import { ZibalCallbackDto } from '../dto/zibal-callback.dto';
import { PaymentEntity } from '../entities/payment.entity';
import { AuthenticationGuard } from '@/utils/guard/auth.guard';
import { AuthorizedGuard } from '@/utils/guard/authorized-role.guard';
import { CurrentUser } from '@/utils/decorators/currentUser.decorator';
import { UserEntity } from '@/users/entities/user.entity';
import { Roles } from '@/utils/common/Roles.enum';
import { extractClientIp } from '@/utils/http/extract-client-ip.util';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment for an order' })
  @ApiResponse({
    status: 201,
    description: 'Payment initiated — redirect the user to payUrl',
    schema: {
      example: {
        trackId: '1533727744287',
        payUrl:  'https://gateway.zibal.ir/start/1533727744287',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Order not in PROCESSING state or already paid' })
  @ApiResponse({ status: 403, description: 'Order does not belong to the authenticated user' })
  @ApiResponse({ status: 502, description: 'Zibal gateway unreachable or rejected the request' })
  async checkout(
    @Body() dto: CheckoutDto,
    @CurrentUser() user: UserEntity,
    @Req() req: Request,
  ) {
    return this.paymentService.initiatePayment(dto.orderId, user, extractClientIp(req));
  }

  @Get('callback')
  @Redirect()
  @ApiOperation({
    summary: 'Zibal browser redirect — do not call from frontend code',
    description:
      'Zibal redirects the user here after payment. This endpoint validates the query params ' +
      'and immediately redirects to the frontend result page. ' +
      'Actual payment confirmation requires a subsequent call to POST /payment/verify.',
  })
  @ApiResponse({ status: 302, description: 'Redirects to frontend /payment/result page' })
  async callback(@Query() query: ZibalCallbackDto) {
    const frontendBase = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const status = query.success === '1' ? 'pending-verify' : 'cancelled';
    return {
      url: `${frontendBase}/payment/result?trackId=${query.trackId}&status=${status}`,
      statusCode: 302,
    };
  }

  @Post('verify')
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify payment with Zibal',
    description:
      'Call this after the user is redirected back from Zibal. ' +
      'Performs server-side verification and marks the order as paid on success.',
  })
  @ApiResponse({
    status: 201,
    description: 'Verification result',
    schema: {
      example: { success: true, alreadyVerified: false },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid trackId, amount mismatch, or payment already failed' })
  @ApiResponse({ status: 403, description: 'Payment does not belong to the authenticated user' })
  @ApiResponse({ status: 502, description: 'Zibal unreachable during verification' })
  async verify(
    @Body() dto: VerifyDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.paymentService.verifyPayment(dto.trackId, user);
  }

  @Get('admin')
  @UseGuards(AuthenticationGuard, AuthorizedGuard([Roles.ADMIN]))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: inspect a payment record by trackId' })
  @ApiQuery({ name: 'trackId', example: '1533727744287', description: 'Zibal transaction ID' })
  @ApiResponse({ status: 200, description: 'Payment record', type: PaymentEntity })
  @ApiResponse({ status: 404, description: 'No payment found for this trackId' })
  async adminGetPayment(@Query('trackId') trackId: string) {
    return this.paymentService.getPaymentByTrackId(trackId);
  }
}
