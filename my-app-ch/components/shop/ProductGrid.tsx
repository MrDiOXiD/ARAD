'use client';

import PromoBanner from './PromoBanner';
import ProductCard from './ProductCard';
import { BadgeVariant } from '@/interfaces/shop/types';
import { useProducts } from '@/hooks/reactQuery/useProducts';

export default function ProductGrid() {

  const { data: products, isLoading, isError } = useProducts();


  if (isLoading) {
    return (
      <div className="shop-grid">
        <PromoBanner />
        <p className="text-center py-10 w-full col-span-full">در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="shop-grid">
        <PromoBanner />
        <p className="text-center text-red-500 py-10 w-full col-span-full">
          خطا در دریافت لیست محصولات.
        </p>
      </div>
    );
  }


  return (
    <div className="shop-grid">
      <PromoBanner />

      {products && products.length > 0 ? (
        products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              discount: product.discount && product.discount !== "0.00" ? product.discount : undefined,

              brand: product.brand || 'متفرقه', // 'Generic' / 'Miscellaneous'

              icon: product.productImage || '/placeholder-icon.png',

              rating: 0,
              reviews: '0',

              badge: product.badge ? (product.badge as BadgeVariant) : undefined,
            }}
            // If your ProductCard requires animationDelay based on earlier errors:
            animationDelay={index * 45}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 py-10 w-full col-span-full">
          محصولی برای نمایش وجود ندارد.
        </p>
      )}
    </div>
  );
}