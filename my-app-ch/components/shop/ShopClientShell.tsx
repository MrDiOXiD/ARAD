'use client';

import { useState } from 'react';
import ShopTopBar from './ShopTopBar';
import FilterPanel from './FilterPanel';
import MobileFilterDrawer from './MobileFilterDrawer';
import ProductGrid from './ProductGrid';
import ShopPagination from './ShopPagination';
import { BRANDS, SORT_OPTIONS } from '@/utils/mockData/shopData';

export default function ShopClientShell() {
  /* ── Filter state ── */
  const [activeSort,       setActiveSort]       = useState<string>(SORT_OPTIONS[0]);
  const [activeCategory,   setActiveCategory]   = useState('all');
  const [activeBrands,     setActiveBrands]     = useState<string[]>([BRANDS[0]]);
  const [priceValue,       setPriceValue]       = useState(60);
  const [onlyInStock,      setOnlyInStock]      = useState(true);
  const [onlyDiscounted,   setOnlyDiscounted]   = useState(false);

  /* ── UI state ── */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleBrandToggle = (brand: string) =>
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Shared filter props — passed identically to sidebar and drawer */
  const filterProps = {
    activeCategory,
    onCategoryChange:  setActiveCategory,
    onCategoryReset:   () => setActiveCategory('all'),
    activeBrands,
    onBrandToggle:     handleBrandToggle,
    priceValue,
    onPriceChange:     setPriceValue,
    onlyInStock,
    onStockChange:     setOnlyInStock,
    onlyDiscounted,
    onDiscountedChange: setOnlyDiscounted,
  };

  return (
    <div className="shop-wrap" dir="rtl">
      <ShopTopBar
        activeSort={activeSort}
        onSortChange={setActiveSort}
        onOpenDrawer={() => setDrawerOpen(true)}
      />

      <div className="shop-body">
        {/* Desktop sidebar */}
        <aside className="shop-sidebar" aria-label="فیلتر محصولات">
          <FilterPanel {...filterProps} />
        </aside>

        {/* Product grid + pagination */}
        <div className="shop-grid-wrap">
          <ProductGrid />
          <ShopPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileFilterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        {...filterProps}
      />
    </div>
  );
}
