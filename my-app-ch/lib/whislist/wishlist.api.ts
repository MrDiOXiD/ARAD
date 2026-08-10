import { authFetch } from "../auth/authFetch";

export interface WishlistProduct {
  id: number;
  title: string;
  price: number;
  // ...whatever ProductEntity actually exposes; adjust to match
}

export interface WishlistItem {
  productId: number;
  product: WishlistProduct;
  createdAt: string;
}

export function getWishlist(): Promise<WishlistItem[]> {
  return authFetch<WishlistItem[]>('/user/wishlist', { method: 'GET' });
}

export function getWishlistProductIds(): Promise<number[]> {
  return authFetch<number[]>('/user/wishlist/ids', { method: 'GET' });
}

export function addToWishlist(productId: number): Promise<WishlistItem> {
  return authFetch<WishlistItem>(`/user/wishlist/${productId}`, { method: 'POST' });
}

export function removeFromWishlist(productId: number): Promise<{ removed: boolean }> {
  return authFetch<{ removed: boolean }>(`/user/wishlist/${productId}`, { method: 'DELETE' });
}
