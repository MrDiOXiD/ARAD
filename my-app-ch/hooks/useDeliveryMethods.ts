'use client';

import { useQuery } from '@tanstack/react-query';
import * as api from '@/lib/delivery/deliveryMethods.api';

export function useDeliveryMethods() {
  const query = useQuery({
    queryKey: ['delivery-methods'],
    queryFn: api.getActiveDeliveryMethods,
    staleTime: 5 * 60 * 1000, // rarely changes, safe to cache longer
  });

  return { methods: query.data ?? [], isLoading: query.isLoading };
}
