'use client';

import { useState } from 'react';
import WishlistHeader from './WishlistHeader';
import WishlistGrid from './WishlistGrid';
import * as wishlistApi from '@/lib/whislist/wishlist.api';   // adjust path to match your actual file
import { useQueryClient } from '@tanstack/react-query';
import { useWishlist } from '@/hooks/useWishlist';

export default function WishlistClientShell() {
  // Real backend data instead of WISHLIST_ITEMS mock — ids here are
  // numbers (matching WishlistItemResponseDto), not the strings the
  // old mock data used. WishlistGrid/WishlistCard's prop types need
  // updating to number ids too if they still expect strings.
  const { items, isLoading } = useWishlist();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);


console.log(items);


  const handleSelect = (id: number, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );

  const handleRemove = async (productId: number) => {
    await wishlistApi.removeFromWishlist(productId);
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    setSelectedIds((prev) => prev.filter((x) => x !== productId));
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedIds.map((productId) => wishlistApi.removeFromWishlist(productId)));
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    setSelectedIds([]);
  };

  const handleAddToCart = (productId: number) => {
    // TODO: connect to your existing cart context/redux slice
    console.log('Add to cart:', productId);
  };

  if (isLoading) {
    return <div className="wl-page__loading" aria-busy="true" />;
  }

  return (
    <div className="wl-page" dir="rtl">
      <WishlistHeader
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
      />
      <WishlistGrid
        items={items}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
