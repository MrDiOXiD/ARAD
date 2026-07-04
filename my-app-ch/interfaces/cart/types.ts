export interface CartItemTag {
  label: string;
  colorDot?: 'yellow' | 'blue';
}

export interface CartItem {
  id: number;
  title: string;
  icon: string;          // emoji placeholder — swap for image path when ready
  bgColor: string;       // placeholder background color
  unitPrice: number;
  quantity: number;
  tags: CartItemTag[];
}
