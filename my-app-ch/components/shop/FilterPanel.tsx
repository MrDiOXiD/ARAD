import { BRANDS, CATEGORIES } from "@/utils/mockData/shopData";

interface FilterPanelProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onCategoryReset: () => void;
  activeBrands: string[];
  onBrandToggle: (brand: string) => void;
  priceValue: number;
  onPriceChange: (value: number) => void;
  onlyInStock: boolean;
  onStockChange: (checked: boolean) => void;
  onlyDiscounted: boolean;
  onDiscountedChange: (checked: boolean) => void;
}

export default function FilterPanel({
  activeCategory,
  onCategoryChange,
  onCategoryReset,
  activeBrands,
  onBrandToggle,
  priceValue,
  onPriceChange,
  onlyInStock,
  onStockChange,
  onlyDiscounted,
  onDiscountedChange,
}: FilterPanelProps) {
  return (
    <>
      {/* دسته‌بندی */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">
          دسته‌بندی
          <button type="button" className="shop-filter-reset" onClick={onCategoryReset}>
            پاک کردن
          </button>
        </div>
        <div className="shop-filter-cats">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`shop-filter-cat${activeCategory === category.id ? ' active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="shop-filter-cat-dot" />
              <i className={`bi ${category.icon}`} />
              {category.label}
              <span className="shop-filter-cat-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* محدوده قیمت */}
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
            value={priceValue}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to left, #F5C518 ${priceValue}%, #e5e5e5 ${priceValue}%)`,
            }}
          />
        </div>
      </div>

      {/* برند */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">برند</div>
        <div className="shop-brand-grid">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              type="button"
              className={`shop-brand-chip${activeBrands.includes(brand) ? ' active' : ''}`}
              onClick={() => onBrandToggle(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* وضعیت موجودی */}
      <div className="shop-filter-box">
        <div className="shop-filter-title">وضعیت موجودی</div>
        <div className="shop-stock-list">
          <label className="shop-stock-row">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onStockChange(e.target.checked)}
            />
            فقط موجود در انبار
          </label>
          <label className="shop-stock-row">
            <input
              type="checkbox"
              checked={onlyDiscounted}
              onChange={(e) => onDiscountedChange(e.target.checked)}
            />
            فقط تخفیف‌دار
          </label>
        </div>
      </div>
    </>
  );
}
