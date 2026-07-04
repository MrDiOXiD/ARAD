import { PAGE_BUTTONS, TOTAL_PAGES, TOTAL_PRODUCTS } from "@/utils/mockData/shopData";

interface ShopPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function ShopPagination({ currentPage, onPageChange }: ShopPaginationProps) {
  return (
    <div className="shop-pagination">
      <span className="shop-pagination-info">
        نمایش ۱۰ از {TOTAL_PRODUCTS} محصول — صفحه{' '}
        {currentPage.toLocaleString('fa-IR')} از{' '}
        {TOTAL_PAGES.toLocaleString('fa-IR')}
      </span>

      <nav className="shop-pagination-wrap" aria-label="صفحه‌بندی">
        <button
          type="button"
          className={`shop-pg-btn arrow${currentPage === 1 ? ' disabled' : ''}`}
          aria-label="صفحه قبل"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        >
          <i className="bi bi-chevron-right" />
        </button>

        {PAGE_BUTTONS.map((btn, index) =>
          btn === '...' ? (
            <span key={`dots-${index}`} className="shop-pg-dots">•••</span>
          ) : (
            <button
              key={btn}
              type="button"
              className={`shop-pg-btn${currentPage === btn ? ' active' : ''}`}
              aria-current={currentPage === btn ? 'page' : undefined}
              onClick={() => onPageChange(btn)}
            >
              {btn.toLocaleString('fa-IR')}
            </button>
          )
        )}

        <button
          type="button"
          className={`shop-pg-btn arrow${currentPage === TOTAL_PAGES ? ' disabled' : ''}`}
          aria-label="صفحه بعد"
          onClick={() => currentPage < TOTAL_PAGES && onPageChange(currentPage + 1)}
        >
          <i className="bi bi-chevron-left" />
        </button>
      </nav>
    </div>
  );
}
