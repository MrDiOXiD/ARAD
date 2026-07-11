// app/cart/page.tsx  — Server Component
// Replace INITIAL_CART_ITEMS with your real cart fetch (e.g. from DB / API / cookie session)

import CartClientShell from '@/components/cart/CartClientShell';
import { CartItem } from '@/interfaces/cart/types';
import '@/styles/components/cart.css';
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    title: 'لامپ LED اشکال مدل E27 12 وات نور گرم',
    icon: '💡',
    bgColor: '#f0f0f0',
    unitPrice: 185_000,
    quantity: 2,
    tags: [
      { label: 'توان: ۱۲ وات' },
      { label: 'نوع پایه: E27' },
      { label: 'رنگ نور: نور گرم', colorDot: 'yellow' },
    ],
  },
  {
    id: 2,
    title: 'سوئیچ اتوماتیک شناور ۲۵ آمپر برند هیمو',
    icon: '🕹️',
    bgColor: '#e0e0e0',
    unitPrice: 920_000,
    quantity: 1,
    tags: [
      { label: 'آمپر: ۲۵A' },
      { label: 'نوع: شناور' },
    ],
  },
  {
    id: 3,
    title: 'سیم و کابل برق مسی ۲.۵ میلی‌متر شاخه ۱۰۰ متری',
    icon: '🔌',
    bgColor: '#d8d8d8',
    unitPrice: 1_280_000,
    quantity: 1,
    tags: [
      { label: 'مقطع: ۲.۵ mm²' },
      { label: 'طول: ۱۰۰ متر' },
      { label: 'رنگ: آبی', colorDot: 'blue' },
    ],
  },
];

export default function CartPage() {
  return <CartClientShell initialItems={INITIAL_CART_ITEMS} />;
}
