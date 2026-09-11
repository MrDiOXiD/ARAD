import { Product } from '@/components/product/ProductCard';
import { ProductApi } from './products.api';

// ProductCard already computes discount/oldPrice itself from
// price+discount strings — just pass fields through, no pre-computation.
export function mapProductToCard(p: ProductApi): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    discount: p.discount ?? undefined,
    badge: p.badge,
    productImage: p.productImage ?? undefined,
  };
}
