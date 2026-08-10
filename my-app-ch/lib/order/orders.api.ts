import { authFetch } from '../auth/authFetch';

export interface OrderProductInput {
  productId: number;
  order_quantity: number;
}

export interface CreateOrderPayload {
  addressId?: number;
  shippingAddress?: {
    phone: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  orderProducts: OrderProductInput[];
  deliveryMethodId: number;
  requestedDeliveryDate: string; // 'YYYY-MM-DD'
  paymentMethod: 'online' | 'cod';
}

export interface CreateOrderResponse {
  order: { id: number; status: string };
  totalPrice: number;
  deliveryFee: number;
  grandTotal: number;
}

export function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  return authFetch<CreateOrderResponse>('/orders', { method: 'POST', body: payload });
}

export interface InitiatePaymentResponse {
  payUrl: string;
  trackId: string;
}

// Real route per your Swagger list: POST /payment/checkout — not
// /payment/initiate, which was an earlier placeholder guess.
export function initiatePayment(orderId: number): Promise<InitiatePaymentResponse> {
  return authFetch<InitiatePaymentResponse>('/payment/checkout', {
    method: 'POST',
    body: { orderId },
  });
}
