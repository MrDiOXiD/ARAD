import PromoBanner from './PromoBanner';
import ProductCard from './ProductCard';
import { PRODUCTS } from '@/utils/mockData/shopData';

export default function ProductGrid() {
  return (
    <div className="shop-grid">
      <PromoBanner />
      {PRODUCTS.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          animationDelay={index * 45}
        />
      ))}
    </div>
  );
}
