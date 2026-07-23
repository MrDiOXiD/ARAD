export type BadgeVariant = 'new' | 'sale' | 'hot';

export interface Category {
  id: string;
  label: string;
  icon: string;
  count: string;
}

export interface ShopProduct {
  id: number;
  title: string;
  price: string;
  brand?: string;
  icon?: string;          // emoji fallback
  productImage?: string;  // ← add this: real S3 URL from API
  rating?: number;
  reviews?: string;
  badge?: BadgeVariant;
  oldPrice?: string;
  discount?: string;
}