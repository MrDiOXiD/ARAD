'use client';

import { WishlistItem } from "@/interfaces/dashboard/whishlist/wishlist";


interface WishlistCardProps {
  item: WishlistItem;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export default function WishlistCard({
  item,
  isSelected,
  onSelect,
  onRemove,
  onAddToCart,
}: WishlistCardProps) {
  return (
    <article className="wl-card">
      {/* Top-left heart (remove from wishlist) */}
      <button
        type="button"
        className="wl-card__heart-btn"
        onClick={() => onRemove(item.id)}
        aria-label={`حذف ${item.title} از علاقه‌مندی‌ها`}
      >
        <i className="bi bi-heart-fill" aria-hidden="true" />
      </button>

      {/* Top-right checkbox */}
      <label className="wl-card__checkbox-wrap" aria-label={`انتخاب ${item.title}`}>
        <input
          type="checkbox"
          className="wl-card__checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
        />
      </label>

      {/* Product image */}
      <div
        className="wl-card__img"
        style={{ backgroundColor: item.bgColor }}
        aria-label={item.title}
      >
        <span className="wl-card__img-icon" aria-hidden="true">
          {item.icon}
        </span>
      </div>

      {/* Info */}
      <div className="wl-card__body">
        <p className="wl-card__title">{item.title}</p>
        <p className="wl-card__price">
          <span className="wl-card__price-amount">{item.price}</span>
          <span className="wl-card__price-unit"> تومان</span>
        </p>
      </div>

      {/* Actions */}
      <div className="wl-card__actions">
        <button
          type="button"
          className="wl-card__cart-btn"
          onClick={() => onAddToCart(item.id)}
          aria-label={`افزودن ${item.title} به سبد خرید`}
        >
          <i className="bi bi-cart2" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="wl-card__more-btn"
          aria-label="گزینه‌های بیشتر"
        >
          <span className="wl-card__more-dots">•••</span>
        </button>
      </div>
    </article>
  );
}
