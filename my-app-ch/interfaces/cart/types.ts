export interface CartItemTag {
  label: string;
  colorDot?: 'yellow' | 'blue';
}

export interface CartItem {
  id: number;
  title: string;
  icon: string;            // emoji fallback placeholder
  productImage?: string;   // real image URL from API
  unitPrice: number;
  quantity: number;
  tags: CartItemTag[];
}
