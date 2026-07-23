import { useQuery } from '@tanstack/react-query';
import { getFetch } from '@/utils/fetch';
import { ApiProduct } from '@/interfaces/ProductApi/types';

// --------------------------------------------------
// 1. Hook to fetch ALL products (for the Shop Grid)
// --------------------------------------------------
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const data = await getFetch<ApiProduct[]>('/products');
      return data;
    },
  });
};

// --------------------------------------------------
// 2. Hook to fetch a SINGLE product by ID (for the [id] page)
// --------------------------------------------------
export const useProduct = (id: string | undefined) => {
  return useQuery({
    // React Query is smart: ['product', '14'] is treated as a separate cache from ['product', '15']
    queryKey: ['product', id], 
    
    queryFn: async () => {
      const data = await getFetch<ApiProduct>(`/products/${id}`);
      return data;
    },
    
    // The query will not execute until the `id` actually exists
    enabled: !!id, 
  });
};