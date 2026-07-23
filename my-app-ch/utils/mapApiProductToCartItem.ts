import { ApiProduct } from '@/interfaces/ProductApi/types';
import { CartItem } from '@/interfaces/cart/types';

/**
 * Maps a raw ApiProduct (from your /products/:id endpoint)
 * into a CartItem shape that Redux can store.
 *
 * API shape (example):
 * {
 *   "json": {
 *     "id": 9,
 *     "title": "لامپ LED حبابی ۹ وات",
 *     "price": "45000.00",
 *     "discount": "22.00",
 *     "stock": 100,
 *     "productImage": "https://...",
 *     "brand": null,
 *     "attributes": null,
 *     ...
 *   }
 * }
 */
export function mapApiProductToCartItem(
  product: ApiProduct,
  quantity = 1,
): CartItem {
  // Price is returned as a string like "45000.00" — parse to number
  const unitPrice = Math.round(parseFloat(product.price));

  // Build attribute tags (e.g. { "نور": "بسیار زیاد" } → [{ label: "نور: بسیار زیاد" }])
  const attributeTags = product.attributes
    ? Object.entries(product.attributes).map(([key, value]) => ({
        label: `${key}: ${value}`,
      }))
    : [];

  // Append brand as a tag if present
  const brandTag = product.brand ? [{ label: `برند: ${product.brand}` }] : [];

 // utils/mapApiProductToCartItem.ts
return {
  id: product.id,
  title: product.title,
  icon: '📦',                        // ← always emoji
  productImage: product.productImage ?? undefined,  // ← URL here
  unitPrice,
  quantity,
  tags: [...brandTag, ...attributeTags],
};
}
