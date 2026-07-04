export type BadgeVariant = 'new' | 'sale' | 'hot';

export interface Category {
  id: string;
  label: string;
  icon: string;
  count: string;
}

export interface ShopProduct {
  id: number;
  brand: string;
  title: string;
  icon: string;
  badge?: BadgeVariant;
  rating: number;
  reviews: string;
  oldPrice?: string;
  price: string;
  discount?: string;
}
