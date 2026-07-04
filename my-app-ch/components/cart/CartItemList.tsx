import { CartItem } from '@/interfaces/cart/types';
import CartItemCard from './CartItemCard';

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
