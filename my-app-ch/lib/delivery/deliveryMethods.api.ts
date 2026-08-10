import { authFetch } from '../auth/authFetch';

export interface DeliveryMethod {
  id: number;
  label: string;
  type: 'courier' | 'pickup';
  baseFee: string;
  perItemFee: string;
  isActive: boolean;
}

export function getActiveDeliveryMethods(): Promise<DeliveryMethod[]> {
  return authFetch<DeliveryMethod[]>('/delivery-methods', { method: 'GET' });
}
