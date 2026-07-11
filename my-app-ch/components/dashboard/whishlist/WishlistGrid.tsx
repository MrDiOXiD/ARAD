import { WishlistItem } from '@/interfaces/dashboard/whishlist/wishlist';
import WishlistCard from './WishlistCard';

interface WishlistGridProps {
  items: WishlistItem[];
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
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
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onSelect={onSelect}
            onRemove={onRemove}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
