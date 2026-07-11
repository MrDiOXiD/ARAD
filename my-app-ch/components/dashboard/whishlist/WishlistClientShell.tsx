'use client';

import { useState } from 'react';
import WishlistHeader from './WishlistHeader';
import WishlistGrid from './WishlistGrid';
import { WishlistItem } from '@/interfaces/dashboard/whishlist/wishlist';
import { WISHLIST_ITEMS } from '@/utils/mockData/wishlistData';


export default function WishlistClientShell() {
  const [items, setItems]           = useState<WishlistItem[]>(WISHLIST_ITEMS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const handleDeleteSelected = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  };

  const handleAddToCart = (id: string) => {
    // TODO: connect to cart context / API
    console.log('Add to cart:', id);
  };

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
