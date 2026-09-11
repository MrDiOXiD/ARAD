'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store-redux/hooks';

const Y = '#F5C518';

const TABS = [
  { href: '/dashboard',  label: 'پروفایل',    icon: 'bi-person' },
  { href: '/wishlist',   label: 'علاقه‌مندی', icon: 'bi-heart' },
  { href: '/cart',       label: 'سبد خرید',   icon: 'bi-bag', badge: true },
  { href: '/categories', label: 'دسته‌بندی',  icon: 'bi-grid-3x3-gap' },
  { href: '/',           label: 'خانه',        icon: 'bi-house' },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const cartCount = useAppSelector((state) => state.cart.items.length);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav
      dir="rtl"
      aria-label="ناوبری پایین صفحه"
      className="mobile-tabbar sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200"
    >
      <div className="flex items-stretch justify-around">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 py-2 flex-1 no-underline"
            >
              <div className="relative">
                <i
                  className={`bi ${tab.icon}${active ? '-fill' : ''} text-xl`}
                  style={{ color: active ? Y : '#9ca3af' }}
                  aria-hidden="true"
                />
                {tab.badge && mounted && cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -left-2.5 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-gray-900"
                    style={{ backgroundColor: Y }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium" style={{ color: active ? Y : '#6b7280' }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
