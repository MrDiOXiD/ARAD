import { SORT_OPTIONS, TOTAL_PRODUCTS } from "@/utils/mockData/shopData";

interface ShopTopBarProps {
  activeSort: string;
  onSortChange: (sort: string) => void;
  onOpenDrawer: () => void;
}

export default function ShopTopBar({
  activeSort,
  onSortChange,
  onOpenDrawer,
}: ShopTopBarProps) {
  return (
    <div className="shop-topbar">
      <button
        type="button"
        className="shop-mobile-filter-btn"
        onClick={onOpenDrawer}
        aria-label="باز کردن فیلترها"
      >
        <i className="bi bi-sliders" /> فیلترها
      </button>

      <div className="shop-topbar-sort">
        <span className="shop-topbar-sort-label">مرتب‌سازی:</span>
        {SORT_OPTIONS.map((sort) => (
          <button
            key={sort}
            type="button"
            className={`shop-sort-chip${activeSort === sort ? ' active' : ''}`}
            onClick={() => onSortChange(sort)}
          >
            {sort}
          </button>
        ))}
      </div>

      <span className="shop-topbar-count">{TOTAL_PRODUCTS} محصول</span>
    </div>
  );
}
