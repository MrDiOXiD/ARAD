import { ShopProduct } from '@/interfaces/shop/types';
import { CartItem } from '@/interfaces/cart/types';

export function mapShopProductToCartItem(
  product: ShopProduct,
  quantity = 1,
): CartItem {
  const unitPrice = Math.round(parseFloat(product.price));
  const brandTag = product.brand ? [{ label: `برند: ${product.brand}` }] : [];

 // utils/mapShopProductToCartItem.ts
return {
  id: product.id,
  title: product.title,
  icon: '📦',                        // ← always an emoji, never a URL
  productImage: product.productImage ?? product.icon, // ← URL goes here
  unitPrice,
  quantity,
  tags: brandTag,
};
}