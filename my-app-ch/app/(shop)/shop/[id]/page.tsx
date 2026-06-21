import type { Metadata } from 'next';
import ProductPage from '@/components/product/ProductPage';
import { antennaProduct } from '@/utils/mockData/product';

export const metadata: Metadata = {
  title: antennaProduct.title,
};

// Replace this with a real data-fetching function (e.g. fetch by params.slug)
// when wiring this page up to your backend / CMS.
export default function ProductDetailPage() {
  const product = antennaProduct;

  return (
    <ProductPage
      product={product}
      onAddToCart={(productId, qty) => {
        // TODO: wire to your cart store / API
        console.log('add to cart', productId, qty);
      }}
      onBuyNow={(productId, qty) => {
        // TODO: wire to your checkout flow
        console.log('buy now', productId, qty);
      }}
      onAddSimilarToCart={(productId) => {
        console.log('add similar to cart', productId);
      }}
    />
  );
}
