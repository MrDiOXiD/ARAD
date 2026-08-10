'use client';

import { WishlistItem } from '@/lib/whislist/wishlist.api'; // was the mock interfaces path

interface WishlistCardProps {
  item: WishlistItem;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onRemove: (id: number) => void;
  onAddToCart: (id: number) => void;
}

export default function WishlistCard({
  item,
  isSelected,
  onSelect,
  onRemove,
  onAddToCart,
}: WishlistCardProps) {
  // item.id is the wishlist row's own id — only useful as a React key.
  // Every action (remove, add-to-cart, select) needs to act on the
  // actual PRODUCT, so those use item.productId throughout instead.
  const { productId, product } = item;

  // price comes back from Postgres as a string ("130000.00"), not a
  // number, even though the type says number — numeric/decimal columns
  // always do this via pg. Must convert before formatting or it
  // silently does string concatenation instead of number formatting.
  const priceDisplay = Number(product.price).toLocaleString('fa-IR');

  return (
    <article className="wl-card">
      {/* Top-left heart (remove from wishlist) */}
      <button
        type="button"
        className="wl-card__heart-btn"
        onClick={() => onRemove(productId)}
        aria-label={`حذف ${product.title} از علاقه‌مندی‌ها`}
      >
        <i className="bi bi-heart-fill" aria-hidden="true" />
      </button>

      {/* Top-right checkbox */}
      <label className="wl-card__checkbox-wrap" aria-label={`انتخاب ${product.title}`}>
        <input
          type="checkbox"
          className="wl-card__checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(productId, e.target.checked)}
        />
      </label>

      {/* Product image — no icon/bgColor field exists on the real
          product data (those were mock-only). Using a placeholder
          until you tell me the real image field name on ProductEntity
          to swap this for an actual <img>. */}
      <div className="wl-card__img" aria-label={product.title}>
        <i className="bi bi-image wl-card__img-icon" aria-hidden="true" />
      </div>

      {/* Info */}
      <div className="wl-card__body">
        <p className="wl-card__title">{product.title}</p>
        <p className="wl-card__price">
          <span className="wl-card__price-amount">{priceDisplay}</span>
          <span className="wl-card__price-unit"> تومان</span>
        </p>
      </div>

      {/* Actions */}
      <div className="wl-card__actions">
        <button
          type="button"
          className="wl-card__cart-btn"
          onClick={() => onAddToCart(productId)}
          aria-label={`افزودن ${product.title} به سبد خرید`}
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
