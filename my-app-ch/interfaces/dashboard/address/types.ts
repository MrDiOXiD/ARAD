export interface Address {
  id: string;
  label: string;
  icon: 'home' | 'office' | 'warehouse';
  recipientName: string;
  fullAddress: string;
  phone: string;
  isDefault?: boolean;
}
