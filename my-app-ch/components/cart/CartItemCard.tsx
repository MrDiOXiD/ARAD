'use client';

import QuantityPicker from './QuantityPicker';
import TrashIcon from './icons/TrashIcon';
import type { CartItem } from '../types/cart';

function formatPrice(n: number): string {
  return n.toLocaleString('fa-IR');
}

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <article className="cart-card">
      {/* Product image */}
      <div className="cart-card__image">
        <div
          className="cart-card__img-placeholder"
          style={{ backgroundColor: item.bgColor }}
          aria-label={item.title}
        >
          {item.icon}
        </div>
      </div>

      {/* Details */}
      <div className="cart-card__details">
        <h2 className="cart-card__title">{item.title}</h2>

        <div className="cart-card__tags">
          {item.tags.map((tag) => (
            <span key={tag.label} className="cart-card__tag">
              {tag.colorDot && (
                <span
                  className={`cart-card__color-dot cart-card__color-dot--${tag.colorDot}`}
                  aria-hidden="true"
                />
              )}
              {tag.label}
            </span>
          ))}
        </div>

        <div className="cart-card__actions">
          <QuantityPicker
            value={item.quantity}
            onIncrement={() => onQuantityChange(item.id, 1)}
            onDecrement={() => onQuantityChange(item.id, -1)}
          />
          <button
            type="button"
            className="cart-card__delete-btn"
            onClick={() => onRemove(item.id)}
            aria-label={`حذف ${item.title}`}
          >
            <TrashIcon />
            حذف
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="cart-card__pricing">
        <p className="cart-card__unit-price">
          قیمت واحد: {formatPrice(item.unitPrice)} تومان
        </p>
        <p className="cart-card__line-total">
          {formatPrice(lineTotal)} <span>تومان</span>
        </p>
      </div>
    </article>
  );
}
