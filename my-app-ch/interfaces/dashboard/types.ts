export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  icon: string;
  amount: string;
  date: string;
  status: OrderStatus;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface User {
  name: string;
  memberSince: string;
  avatarInitial: string;
}
