export interface ProductBadge {
  label: string;
  variant: 'discount' | 'new' | 'bestseller';
}

export interface ProductImage {
  id: string;
  src?: string; // optional - falls back to placeholder icon when absent
  alt: string;
}

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  bordered?: boolean; // for very light colors like white, add a thin border
}

export interface TypeOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface SpecGroup {
  title: string;
  rows: SpecRow[];
}

export interface SimilarProduct {
  id: string;
  badge?: ProductBadge;
  seller: string;
  title: string;
  rating: number; // 0-5
  reviewCount: number;
  oldPrice?: number;
  price: number;
  discountPercent?: number;
  image?: ProductImage;
  href?: string;
}

export interface SellerInfo {
  name: string;
  rating: number;
  salesCount: number;
  href?: string;
}

export interface TrustItem {
  icon: 'shield' | 'return' | 'shipping';
  title: string;
  text: string;
  linkLabel: string;
  href?: string;
}

export interface ProductDetail {
  id: string;
  sku: string;
  seller: string;
  title: string;
  titleHighlight?: string; // bold portion of the title (e.g. model number)
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  inStock: boolean;
  stockLeft?: number;
  highDemand?: boolean;
  images: ProductImage[];
  colors?: ColorSwatch[];
  types?: TypeOption[];
  warrantyLabel?: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  currency?: string; // default "تومان"
  maxQty?: number;
  perks: string[];
  sellerInfo: SellerInfo;
  specGroups: SpecGroup[];
  similarProducts: SimilarProduct[];
  reviewsCount?: number;
  qaCount?: number;
  description?: string;
}