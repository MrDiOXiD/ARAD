import CartItemCard from './CartItemCard';
import type { CartItem } from '../types/cart';

interface CartItemListProps {
  items: CartItem[];
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItemList({
  items,
  onQuantityChange,
  onRemove,
}: CartItemListProps) {
  return (
    <section className="cart-item-list" aria-label="محصولات سبد خرید">
      {items.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </section>
  );
}
