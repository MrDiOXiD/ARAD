'use client';

import { useState } from 'react';
import '@/styles/components/shop.css';

/* ══════════════════════════════════════════
   STATIC DATA — mirrors the approved mockup
══════════════════════════════════════════ */
interface Category { id: string; label: string; icon: string; count: string; }
interface ShopProduct {
  id: number;
  brand: string;
  title: string;
  icon: string;
  badge?: 'new' | 'sale' | 'hot';
  rating: number;       // filled stars out of 5
  reviews: string;
  oldPrice?: string;
  price: string;
  discount?: string;
}

const CATEGORIES: Category[] = [
  { id: 'all',      label: 'همه محصولات',     icon: 'bi-grid',              count: '۱۲۴' },
  { id: 'lighting', label: 'نور و روشنایی',    icon: 'bi-lightbulb',        count: '۳۸'  },
  { id: 'tools',    label: 'ابزار برقی',        icon: 'bi-tools',            count: '۲۲'  },
  { id: 'switches', label: 'کلید و پریز',       icon: 'bi-toggle-on',        count: '۱۹'  },
  { id: 'antenna',  label: 'آنتن',              icon: 'bi-broadcast',        count: '۱۱'  },
  { id: 'hvac',     label: 'تهویه',             icon: 'bi-thermometer-half', count: '۹'   },
  { id: 'cable',    label: 'سیم و کابل',        icon: 'bi-ethernet',         count: '۲۵'  },
];

const BRANDS = ['پارس شهاب', 'ویسمن', 'بوش', 'اسنوا', 'لگراند', 'ABB'];
const SORTS  = ['پرفروش‌ترین', 'جدیدترین', 'ارزان‌ترین', 'گران‌ترین'];

const PRODUCTS: ShopProduct[] = [
  { id: 1,  brand: 'پارس شهاب',     title: 'لامپ LED حبابی ۹ وات',              icon: 'bi-lightbulb-fill', badge: 'new',  rating: 5, reviews: '۱۲۴', oldPrice: '۵۸,۰۰۰',    price: '۴۵,۰۰۰',    discount: '۲۲٪ تخفیف' },
  { id: 2,  brand: 'ویسمن',         title: 'کلید تبدیل دو پل سری آرا',           icon: 'bi-toggle-on',      badge: 'sale', rating: 4, reviews: '۸۷',  oldPrice: '۱۵۵,۰۰۰',   price: '۱۲۸,۰۰۰',   discount: '۱۷٪ تخفیف' },
  { id: 3,  brand: 'اسنوا',         title: 'پریز دوشاخه شوکو مدل آرتمیس',        icon: 'bi-plug',           badge: 'new',  rating: 5, reviews: '۵۶',  oldPrice: '۱۱۰,۰۰۰',   price: '۸۹,۵۰۰',    discount: '۱۸٪ تخفیف' },
  { id: 4,  brand: 'فاراد',         title: 'سیم برق افشان ۱.۵ میلی‌متر',         icon: 'bi-ethernet',       badge: 'hot',  rating: 4, reviews: '۲۰۳', oldPrice: '۲۸۰,۰۰۰',   price: '۲۳۰,۰۰۰',   discount: '۱۸٪ تخفیف' },
  { id: 5,  brand: 'بوش',           title: 'دریل پیچ‌گوشتی شارژی GSR 120-Li',    icon: 'bi-tools',          badge: 'new',  rating: 5, reviews: '۳۱',  oldPrice: '۳,۹۰۰,۰۰۰', price: '۳,۴۴۸,۹۰۰', discount: '۱۱٪ تخفیف' },
  { id: 6,  brand: 'ایران‌الکتریک', title: 'تابلو برق ۱۸ فاز فلزی',              icon: 'bi-grid-3x3',                      rating: 4, reviews: '۱۴',  oldPrice: '۱,۰۵۰,۰۰۰', price: '۸۵۰,۰۰۰',   discount: '۱۹٪ تخفیف' },
  { id: 7,  brand: 'ABB',           title: 'فیوز مینیاتوری ۱۶ آمپر تک‌فاز',      icon: 'bi-shield-check',   badge: 'sale', rating: 5, reviews: '۴۵',  oldPrice: '۲۳۰,۰۰۰',   price: '۱۸۵,۰۰۰',   discount: '۲۰٪ تخفیف' },
  { id: 8,  brand: 'هانتر',         title: 'ترموستات دیجیتال هوشمند',            icon: 'bi-thermometer',    badge: 'new',  rating: 4, reviews: '۶۷',  oldPrice: '۶۸۰,۰۰۰',   price: '۵۶۰,۰۰۰',   discount: '۱۷٪ تخفیف' },
  { id: 9,  brand: 'سانتک',         title: 'پنل خورشیدی ۱۰۰ وات مونوکریستال',    icon: 'bi-sun',            badge: 'hot',  rating: 5, reviews: '۲۸',  oldPrice: '۵,۱۰۰,۰۰۰', price: '۴,۲۰۰,۰۰۰', discount: '۱۷٪ تخفیف' },
  { id: 10, brand: 'لگراند',        title: 'کابل شبکه CAT6 لگراند ۳۰۵ متر',      icon: 'bi-hdd-network',                   rating: 4, reviews: '۱۹',  oldPrice: '۲,۲۰۰,۰۰۰', price: '۱,۸۵۰,۰۰۰', discount: '۱۶٪ تخفیف' },
];

const badgeLabel: Record<string, string> = { new: 'جدید', sale: 'تخفیف', hot: 'پرفروش' };

/* ── Star rating rendered as filled / empty glyphs ── */
function Stars({ rating, reviews }: { rating: number; reviews: string }) {
  return (
    <div className="shop-card-stars" aria-label={`امتیاز ${rating} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`} />
      ))}
      <span>({reviews})</span>
    </div>
  );
}

export default function ShopPage() {
  /* ── Sort / category / brand / stock — visual state, mirrors the source mockup ── */
  const [activeSort,     setActiveSort]     = useState(SORTS[0]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrands,   setActiveBrands]   = useState<string[]>([BRANDS[0]]);
  const [priceVal,       setPriceVal]       = useState(60);
  const [onlyInStock,    setOnlyInStock]    = useState(true);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [drawerOpen,     setDrawerOpen]     = useState(false);

  /* ── Pagination ── */
  const TOTAL_PAGES = 13;
  const [page, setPage] = useState(1);
  const pageButtons: (number | '...')[] = [1, 2, 3, 4, 5, '...', 12, 13];

  const toggleBrand = (b: string) =>
    setActiveBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);

  const resetCategory = () => setActiveCategory('all');

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ══════════════════════════════════════════
     SHARED FILTER PANEL  (desktop sidebar + mobile drawer)
  ══════════════════════════════════════════ */
  const FilterPanel = () => (
    <>
      {/* دسته‌بندی */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">
          دسته‌بندی
          <button type="button" className="shop-filter-reset" onClick={resetCategory}>
            پاک کردن
          </button>
        </div>
        <div className="shop-filter-cats">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              className={`shop-filter-cat${activeCategory === c.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(c.id)}
            >
              <span className="shop-filter-cat-dot" />
              <i className={`bi ${c.icon}`} />
              {c.label}
              <span className="shop-filter-cat-count">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* قیمت */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">محدوده قیمت</div>
        <div className="shop-filter-range">
          <div className="shop-range-labels">
            <span>۰ تومان</span>
            <span>۱۵,۰۰۰,۰۰۰</span>
          </div>
          <input
            type="range"
            className="shop-range"
            min={0}
            max={100}
            value={priceVal}
            onChange={e => setPriceVal(Number(e.target.value))}
            style={{ background: `linear-gradient(to left, #F5C518 ${priceVal}%, #e5e5e5 ${priceVal}%)` }}
          />
        </div>
      </div>

      {/* برند */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">برند</div>
        <div className="shop-brand-grid">
          {BRANDS.map(b => (
            <button
              key={b}
              type="button"
              className={`shop-brand-chip${activeBrands.includes(b) ? ' active' : ''}`}
              onClick={() => toggleBrand(b)}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* موجودی */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">وضعیت موجودی</div>
        <div className="shop-stock-list">
          <label className="shop-stock-row">
            <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} />
            فقط موجود در انبار
          </label>
          <label className="shop-stock-row">
            <input type="checkbox" checked={onlyDiscounted} onChange={e => setOnlyDiscounted(e.target.checked)} />
            فقط تخفیف‌دار
          </label>
        </div>
      </div>
    </>
  );

  return (
    <div className="shop-wrap" dir="rtl">

      {/* ══════════ TOPBAR — sort + result count ══════════ */}
      <div className="shop-topbar">
        <button
          type="button"
          className="shop-mobile-filter-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="فیلترها"
        >
          <i className="bi bi-sliders" /> فیلترها
        </button>

        <div className="shop-topbar-sort">
          <span className="shop-topbar-sort-label">مرتب‌سازی:</span>
          {SORTS.map(s => (
            <button
              key={s}
              type="button"
              className={`shop-sort-chip${activeSort === s ? ' active' : ''}`}
              onClick={() => setActiveSort(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="shop-topbar-count">۱۲۴ محصول</span>
      </div>

      {/* ══════════ BODY — sidebar + grid ══════════ */}
      <div className="shop-body">

        {/* ── Sidebar (desktop) ── */}
        <aside className="shop-sidebar" aria-label="فیلتر محصولات">
          <FilterPanel />
        </aside>

        {/* ── Grid + pagination ── */}
        <div className="shop-grid-wrap">
          <div className="shop-grid">

            {/* بنر ارسال رایگان */}
            <div className="shop-promo-card">
              <div className="shop-promo-text">
                <h3>ارسال رایگان برای خرید بالای ۵۰۰,۰۰۰ تومان</h3>
                <p>تمام سفارش‌ها در تهران همان روز، شهرستان‌ها ۲–۳ روز کاری</p>
              </div>
              <button type="button" className="shop-promo-btn">
                <i className="bi bi-truck" /> بیشتر بدانید
              </button>
            </div>

            {/* کارت‌های محصول */}
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className="shop-card"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <div className="shop-card-img">
                  {p.badge && (
                    <span className={`shop-badge shop-badge--${p.badge}`}>{badgeLabel[p.badge]}</span>
                  )}
                  <button className="shop-wish-btn" aria-label="افزودن به علاقه‌مندی">
                    <i className="bi bi-heart" />
                  </button>
                  <i className={`bi ${p.icon} shop-card-icon`} />
                </div>
                <div className="shop-card-body">
                  <div className="shop-card-brand">{p.brand}</div>
                  <p className="shop-card-title">{p.title}</p>
                  <Stars rating={p.rating} reviews={p.reviews} />
                  {p.oldPrice && <span className="shop-card-old-price">{p.oldPrice} تومان</span>}
                  <div className="shop-card-price-row">
                    <span className="shop-card-price">{p.price}</span>
                    <span className="shop-card-currency">تومان</span>
                  </div>
                  {p.discount && <span className="shop-card-discount">{p.discount}</span>}
                  <button className="shop-add-btn">
                    <i className="bi bi-cart-plus" /> افزودن به سبد
                  </button>
                </div>
              </div>
            ))}

          </div>{/* end shop-grid */}

          {/* ── Pagination ── */}
          <div className="shop-pagination">
            <span className="shop-pagination-info">
              نمایش ۱۰ از ۱۲۴ محصول — صفحه {page.toLocaleString('fa-IR')} از {TOTAL_PAGES.toLocaleString('fa-IR')}
            </span>
            <div className="shop-pagination-wrap" role="navigation" aria-label="صفحات">
              <button
                type="button"
                className={`shop-pg-btn arrow${page === 1 ? ' disabled' : ''}`}
                aria-label="صفحه قبل"
                onClick={() => page > 1 && goToPage(page - 1)}
              >
                <i className="bi bi-chevron-right" />
              </button>

              {pageButtons.map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="shop-pg-dots">•••</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`shop-pg-btn${page === p ? ' active' : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p.toLocaleString('fa-IR')}
                  </button>
                )
              )}

              <button
                type="button"
                className={`shop-pg-btn arrow${page === TOTAL_PAGES ? ' disabled' : ''}`}
                aria-label="صفحه بعد"
                onClick={() => page < TOTAL_PAGES && goToPage(page + 1)}
              >
                <i className="bi bi-chevron-left" />
              </button>
            </div>
          </div>

        </div>{/* end shop-grid-wrap */}
      </div>{/* end shop-body */}

      {/* ══════════ MOBILE FILTER DRAWER ══════════ */}
      <div
        className={`shop-drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`shop-drawer${drawerOpen ? ' open' : ''}`} role="dialog" aria-label="فیلترها">
        <div className="shop-drawer-head">
          <h3>فیلتر محصولات</h3>
          <button
            type="button"
            className="shop-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="بستن"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="shop-drawer-body">
          <FilterPanel />
          <button
            type="button"
            className="shop-drawer-apply"
            onClick={() => setDrawerOpen(false)}
          >
            اعمال فیلترها
          </button>
        </div>
      </div>

    </div>
  );
}
