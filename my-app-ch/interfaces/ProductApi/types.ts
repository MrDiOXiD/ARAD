// Sub-interface for the Category object
export interface Category {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Sub-interface for the Creator/User object
export interface ProductUser {
  id: number;
  username: string;
  email: string;
  roles?: string[];
}

// Main API Product interface
export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  price: string;             // e.g., "130000.00"
  stock: number;
  discount?: string | null;   // e.g., "15.38"
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  badge?: string | null;      // e.g., "new"
  brand?: string | null;      // e.g., "نور ایران"
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
  createdBy?: ProductUser;
  userId: number;
  isActive: boolean;
  imagePublicId?: string | null;
  productImage: string;
  gallery: string[];          // e.g., []
  attributes?: Record<string, string>; // e.g., { "نور": "بسیار زیاد", "کیفیت": "عالی" }
}