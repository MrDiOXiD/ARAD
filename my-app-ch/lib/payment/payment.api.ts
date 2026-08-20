import { authFetch } from '../auth/authFetch';

export interface OrderSummaryProduct {
  title: string;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  id: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'online' | 'cod';
  paidAt: string | null;
  orderAt: string;
  products: OrderSummaryProduct[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface VerifyPaymentResponse {
  success: boolean;
  alreadyVerified?: boolean;
  order: OrderSummary;
}

export function verifyPayment(trackId: string): Promise<VerifyPaymentResponse> {
  return authFetch<VerifyPaymentResponse>('/payment/verify', { method: 'POST', body: { trackId } });
}

export function switchToCod(orderId: number): Promise<OrderSummary> {
  return authFetch<OrderSummary>(`/payment/switch-to-cod/${orderId}`, { method: 'POST' });
}

export function retryPayment(orderId: number): Promise<{ payUrl: string; trackId: string }> {
  return authFetch<{ payUrl: string; trackId: string }>('/payment/checkout', {
    method: 'POST',
    body: { orderId },
  });
}

export function getMyOrder(orderId: number): Promise<OrderSummary> {
  return authFetch<OrderSummary>(`/orders/mine/${orderId}`, { method: 'GET' });
}
