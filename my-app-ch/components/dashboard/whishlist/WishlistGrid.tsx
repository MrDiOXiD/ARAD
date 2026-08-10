import { WishlistItem } from '@/lib/whislist/wishlist.api'; // was '@/interfaces/dashboard/whishlist/wishlist' — that's the mock type
import WishlistCard from './WishlistCard';

interface WishlistGridProps {
  items: WishlistItem[];
  selectedIds: number[];                              // was string[]
  onSelect: (id: number, checked: boolean) => void;    // was string
  onRemove: (id: number) => void;                      // was string
  onAddToCart: (id: number) => void;                   // was string
}

export default function WishlistGrid({
  items,
  selectedIds,
  onSelect,
  onRemove,
  onAddToCart,
}: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="wl-empty" role="status">
        <i className="bi bi-heart wl-empty__icon" aria-hidden="true" />
        <p className="wl-empty__text">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
      </div>
    );
  }

  return (
    <div className="wl-grid-wrap" dir="rtl">
      <p className="wl-count-chip">
        <span>{items.length}</span> محصول
      </p>

      <div className="wl-grid">
        {items.map((item) => (
          <WishlistCard
            key={item.productId}
            item={item}
            isSelected={selectedIds.includes(item.productId)}
            onSelect={onSelect}
            onRemove={onRemove}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
