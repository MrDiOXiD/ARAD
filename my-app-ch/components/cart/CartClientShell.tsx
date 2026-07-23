'use client';

import { useEffect } from 'react';
import CartHeader from './CartHeader';
import CartItemList from './CartItemList';
import OrderSummary from './OrderSummary';
import { CartItem } from '@/interfaces/cart/types';
import { useAppDispatch, useAppSelector } from '@/store-redux/hooks';
import { changeQuantity, removeItem } from '@/store-redux/features/cart/cartSlice';
import Link from 'next/link';

interface CartClientShellProps {
  initialItems: CartItem[]; // always [] now — localStorage is the source of truth
}

export default function CartClientShell({ initialItems }: CartClientShellProps) {
  const dispatch = useAppDispatch();
  // items come from Redux, which StoreProvider already rehydrated from localStorage
  const { items } = useAppSelector((state) => state.cart);

  // initialItems is kept as a prop for future server-side cart merging
  // (e.g. logged-in user's server cart merged with guest localStorage cart)
  // For now it's unused since StoreProvider handles rehydration.
  void initialItems;

  const handleQuantityChange = (id: number, delta: number) => {
    dispatch(changeQuantity({ id, delta }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeItem(id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  // ── Empty state ───────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div
        dir="rtl"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
          fontFamily: 'Vazirmatn, sans-serif',
          textAlign: 'center',
          padding: '40px 20px',
        }}
      >
        <i className="bi bi-cart-x" style={{ fontSize: '64px', color: '#d1d5db' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
          سبد خرید شما خالی است
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, maxWidth: '300px' }}>
          هنوز محصولی به سبد خرید اضافه نکرده‌اید. برای خرید به فروشگاه بروید.
        </p>
        <Link
          href="/shop"
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F5C518',
            color: '#1a1a1a',
            fontWeight: 700,
            fontSize: '14px',
            padding: '12px 28px',
            borderRadius: '12px',
            textDecoration: 'none',
            transition: 'background 0.18s, transform 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#E0B000';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#F5C518';
            (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
          }}
        >
          <i className="bi bi-shop" />
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  // ── Filled cart ───────────────────────────────────────────────
  return (
    <div className="cart-page" dir="rtl" style={{ fontFamily: 'Vazirmatn, IRANSans, Tahoma, sans-serif' }}>
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
