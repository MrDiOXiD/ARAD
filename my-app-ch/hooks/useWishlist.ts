'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as wishlistApi from '@/lib/whislist/wishlist.api'; // adjust path to wherever you place wishlist.api.ts
import { useAuth } from '@/context/AuthContext';

const WISHLIST_IDS_KEY = ['wishlist', 'ids'] as const;
const WISHLIST_FULL_KEY = ['wishlist', 'full'] as const;

/**
 * Lightweight hook for product cards — just needs to know "is this
 * product favorited" and expose a toggle. Uses the /ids endpoint so
 * the payload stays small even with a large catalog on screen at once.
 */
export function useWishlistIds() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: ids = [] } = useQuery({
    queryKey: WISHLIST_IDS_KEY,
    queryFn: wishlistApi.getWishlistProductIds,
    enabled: isAuthenticated, // logged-out users just see empty hearts, no request fired
    staleTime: 60 * 1000,
  });

  const idSet = new Set(ids);

  const toggleMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (idSet.has(productId)) {
        await wishlistApi.removeFromWishlist(productId);
        return { productId, favorited: false };
      }
      await wishlistApi.addToWishlist(productId);
      return { productId, favorited: true };
    },
    // Optimistic update — the heart should flip the instant you click
    // it, not after a round trip. Roll back on failure.
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_IDS_KEY });
      const previous = queryClient.getQueryData<number[]>(WISHLIST_IDS_KEY) ?? [];
      const next = previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId];
      queryClient.setQueryData(WISHLIST_IDS_KEY, next);
      return { previous };
    },
    onError: (_err, _productId, context) => {
      if (context) queryClient.setQueryData(WISHLIST_IDS_KEY, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_KEY });
      // Keep the dashboard wishlist page's fuller list in sync too,
      // without both hooks needing to know about each other directly.
      queryClient.invalidateQueries({ queryKey: WISHLIST_FULL_KEY });
    },
  });

  return {
    isFavorited: (productId: number) => idSet.has(productId),
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}

/**
 * Full hook for the dashboard wishlist page — needs product details
 * (title, price, image), not just ids.
 */
export function useWishlist() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: WISHLIST_FULL_KEY,
    queryFn: wishlistApi.getWishlist,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
  };
}
