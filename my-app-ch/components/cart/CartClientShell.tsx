'use client';

import { useState } from 'react';
import CartHeader from './CartHeader';
import CartItemList from './CartItemList';
import OrderSummary from './OrderSummary';
import { CartItem } from '@/interfaces/cart/types';

interface CartClientShellProps {
  initialItems: CartItem[];
}

export default function CartClientShell({ initialItems }: CartClientShellProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const handleQuantityChange = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return (
    <div
      className="cart-page"
      dir="rtl"
      style={{ fontFamily: 'Vazirmatn, IRANSans, Tahoma, sans-serif' }}
    >
      <div className="cart-page__container">
        <CartHeader itemCount={items.length} />

        <div className="cart-page__layout">
          <CartItemList
            items={items}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
          <OrderSummary subtotal={subtotal} shippingFree={subtotal >= 500_000} />
        </div>
      </div>
    </div>
  );
}
