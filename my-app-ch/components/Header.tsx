'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const Y = '#F5C518';   // brand yellow - always via inline style, never a custom Tailwind class
const YD = '#E0B000';  // brand yellow dark

const NAV = [
  { label: 'نور و روشنایی',      icon: 'bi-lightbulb'        },
  { label: 'ابزار و لوازم برقی', icon: 'bi-tools'            },
  { label: 'کلید و پریز',        icon: 'bi-toggle-on'        },
  { label: 'آنتن',               icon: 'bi-broadcast'        },
  { label: 'تهویه سرما و گرما',  icon: 'bi-thermometer-half' },
  { label: 'سیم و کابل',         icon: 'bi-ethernet'         },
];

export default function Header() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  /* scroll → deepen shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* stagger mobile nav items */
  useEffect(() => {
    if (!open) return;
    mobRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity   = '0';
      el.style.transform = 'translateX(12px)';
      setTimeout(() => {
        el.style.transition = `opacity 0.28s ${i * 0.06}s ease, transform 0.28s ${i * 0.06}s ease`;
        el.style.opacity    = '1';
        el.style.transform  = 'translateX(0)';
      }, 10);
    });
  }, [open]);

  /* hamburger line transforms */
  const L1: React.CSSProperties = open ? { transform: 'translateY(8px) rotate(45deg)' }  : {};
  const L2: React.CSSProperties = open ? { opacity: 0 }                                   : {};
  const L3: React.CSSProperties = open ? { transform: 'translateY(-8px) rotate(-45deg)' } : {};

  return (
    <header
      dir="rtl"
      className={`header-entry bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}
      style={{ fontFamily: 'Vazirmatn, sans-serif' }}
    >

      {/* ╔══════════════════════════════════╗
          ║           TOP ROW               ║
          ╚══════════════════════════════════╝ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-[68px]">

          {/* Logo placeholder */}
          <Link href="/">
          <div className="hidden md:flex items-center justify-center flex-shrink-0 w-28 h-12 border-2 border-dashed border-gray-300 rounded-xl text-gray-300 text-xs">
            لوگو
          </div>
          </Link>

          {/* vertical divider */}
          <div className="hidden sm:block w-px h-10 bg-gray-200 flex-shrink-0" />

          {/* Search bar */}
          <div className="flex-1 search-wrap">
            <div className="search-bar flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 transition-all duration-200">
              <button
                type="button"
                className="search-shine flex-shrink-0 h-11 sm:h-12 px-4 sm:px-5 flex items-center justify-center border-none cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: Y }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = YD; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = Y;  }}
              >
                <i className="bi bi-search text-gray-900 text-lg" />
              </button>
              <input
                type="text"
                placeholder="کالای مورد نظر را جستجو کنید ..."
                className="flex-1 bg-transparent outline-none border-none text-right text-sm sm:text-base text-gray-700 placeholder-gray-400 px-3 h-11 sm:h-12"
                style={{ direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif' }}
              />
            </div>
          </div>

          {/* vertical divider */}
          <div className="hidden sm:block w-px h-10 bg-gray-200 flex-shrink-0" />

          {/* User actions — desktop */}
          <div className="hidden sm:flex items-center gap-5 flex-shrink-0">

            {/* Cart */}
            <Link href="/cart" className="top-action relative flex flex-col items-center gap-0.5 text-gray-700 no-underline">
              <span className="action-tip">سبد خرید</span>
              <div className="relative">
                <i className="bi bi-bag text-2xl" />
                <span
                  className="badge-pulse absolute -top-1.5 -left-1.5 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold leading-none text-gray-900"
                  style={{ backgroundColor: Y }}
                >۲</span>
              </div>
              <span className="text-[11px] text-gray-500">سبد خرید</span>
            </Link>

            {/* Login */}
            <Link href="/auth" className="top-action relative flex flex-col items-center gap-0.5 text-gray-700 no-underline">
              <span className="action-tip">ثبت نام</span>
              <i className="bi bi-person text-2xl" />
              <span className="text-[11px] text-gray-500">ثبت نام</span>
            </Link>

            {/* Wishlist */}
            <Link href="#" className="top-action relative flex flex-col items-center gap-0.5 text-gray-700 no-underline">
              <span className="action-tip">علاقه‌مندی</span>
              <i className="bi bi-heart text-2xl" />
              <span className="text-[11px] text-gray-500">ایلیا احمد معظم</span>
            </Link>

          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(p => !p)}
            aria-label="منو"
            className="flex sm:hidden flex-col gap-1.5 p-1 ml-auto flex-shrink-0 bg-transparent border-none cursor-pointer"
          >
            <span className="block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300" style={L1} />
            <span className="block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300" style={L2} />
            <span className="block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300" style={L3} />
          </button>

        </div>
      </div>

      {/* horizontal rule */}
      <div className="border-t border-gray-200" />

      {/* ╔══════════════════════════════════╗
          ║         BOTTOM NAV (desktop)    ║
          ╚══════════════════════════════════╝ */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch">

          {/* Phone block — pushed to far right in RTL */}
          <div className="flex items-center flex-shrink-0 pl-6 border-l border-gray-200 ml-auto">
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-gray-400 mb-0.5">نیاز به راهنمایی دارید؟</span>
              <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm" dir="ltr">
                <span>۰۲۱-۷۷۲۶۸۰۰۴</span>
                <i className="bi bi-telephone-fill text-[15px] phone-wiggle cursor-pointer" style={{ color: Y }} />
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-stretch flex-1 justify-around" aria-label="منو اصلی">
            {NAV.map(({ label, icon }) => (
              <Link
                key={label}
                href="#"
                className="nav-item-link flex flex-col items-center justify-center gap-1 px-2 lg:px-4 py-3 text-gray-700 no-underline hover:text-gray-900 transition-colors duration-200"
              >
                <span className="text-xs lg:text-sm font-medium whitespace-nowrap">{label}</span>
                <i className={`bi ${icon} nav-icon text-lg lg:text-xl text-gray-400`} />
              </Link>
            ))}
          </nav>

        </div>
      </div>

      {/* ╔══════════════════════════════════╗
          ║          MOBILE MENU            ║
          ╚══════════════════════════════════╝ */}
      {open && (
        <div className="mobile-menu-drop sm:hidden bg-white border-t border-gray-100 px-4 pb-4">

          {/* mobile search */}
          <div className="pt-3 pb-2">
            <div className="search-wrap">
              <div className="search-bar flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  type="button"
                  className="flex-shrink-0 h-10 px-4 flex items-center justify-center border-none cursor-pointer"
                  style={{ backgroundColor: Y }}
                >
                  <i className="bi bi-search text-gray-900" />
                </button>
                <input
                  type="text"
                  placeholder="جستجو ..."
                  className="flex-1 bg-transparent outline-none border-none text-right text-sm text-gray-700 placeholder-gray-400 px-3 h-10"
                  style={{ direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* phone */}
          <div className="flex items-center gap-2 py-3 border-b border-gray-100 mb-1">
            <i className="bi bi-telephone-fill" style={{ color: Y }} />
            <span className="text-sm font-semibold text-gray-800" dir="ltr">۰۲۱-۷۷۲۶۸۰۰۴</span>
            <span className="text-[11px] text-gray-400 mr-auto">نیاز به راهنمایی دارید؟</span>
          </div>

          {/* nav links */}
          <nav className="flex flex-col">
            {NAV.map(({ label, icon }, i) => (
              <Link
                key={label}
                href="#"
                ref={el => { mobRefs.current[i] = el; }}
                className="flex items-center gap-3 py-3 px-2 text-gray-700 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors duration-150 no-underline text-sm font-medium"
              >
                <i className={`bi ${icon} text-lg w-6 text-center`} style={{ color: Y }} />
                <span>{label}</span>
                <i className="bi bi-chevron-left text-gray-300 mr-auto text-xs" />
              </Link>
            ))}
          </nav>

          {/* mobile user actions */}
          <div className="flex items-center justify-around pt-4 mt-2 border-t border-gray-100">
            <Link href="#" className="flex flex-col items-center gap-1 text-gray-600 no-underline">
              <div className="relative">
                <i className="bi bi-bag text-xl" />
                <span className="badge-pulse absolute -top-1.5 -left-1.5 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-gray-900" style={{ backgroundColor: Y }}>۲</span>
              </div>
              <span className="text-xs text-gray-500">سبد خرید</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1 text-gray-600 no-underline">
              <i className="bi bi-person text-xl" />
              <span className="text-xs text-gray-500">ثبت نام</span>
            </Link>
            <Link href="#" className="flex flex-col items-center gap-1 text-gray-600 no-underline">
              <i className="bi bi-heart text-xl" />
              <span className="text-xs text-gray-500">علاقه‌مندی</span>
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}
