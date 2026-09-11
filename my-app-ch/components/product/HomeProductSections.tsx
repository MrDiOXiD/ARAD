'use client';

import { useQuery } from '@tanstack/react-query';
import ProductSection from '@/components/product/ProductSection';
import { getProducts } from '@/lib/product/products.api';
import { mapProductToCard } from '@/lib/product/mapProductToCard';


export default function HomeProductSections() {
  // Same queryKey as the server prefetch — this is what makes
  // hydration actually connect the two. Data is already here from SSR;
  // this just gives you normal client-side React Query behavior
  // (refetch on focus, cache invalidation, etc.) going forward.
  const { data: latest } = useQuery({
    queryKey: ['products', 'latest'],
    queryFn: () => getProducts(1, 8),
  });
  const { data: featured } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts(2, 12),
  });

  return (
    <>
      <ProductSection title="جدیدترین‌ها" products={(latest ?? []).map(mapProductToCard)} scroll />
      <ProductSection title="کالاهای منتخب" products={(featured ?? []).map(mapProductToCard)} />
    </>
  );
}
