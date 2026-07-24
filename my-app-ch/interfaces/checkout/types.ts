export interface CheckoutAddress {
  id: string;
  tag: string;
  name: string;
  phone: string;
  addressLine: string;
  postalCode: string;
}

export interface ShippingTimeOption {
  value: string;
  label: string;
}

export interface ShippingMethodOption {
  value: string;
  label: string;
  icon: string;
}

export type PaymentMethod = 'online' | 'cod';

export interface OrderItem {
  id: string;
  title: string;
  qty: number;
  price: number;
}

export interface StepperStep {
  key: string;
  label: string;
  icon: string;
  status: 'done' | 'active' | 'upcoming';
}

export interface OrderTotals {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}
