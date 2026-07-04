import FilterPanel from './FilterPanel';
import type { ComponentProps } from 'react';

type FilterPanelProps = ComponentProps<typeof FilterPanel>;

interface MobileFilterDrawerProps extends FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  ...filterPanelProps
}: MobileFilterDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`shop-drawer-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`shop-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="فیلتر محصولات"
      >
        <div className="shop-drawer-head">
          <h3>فیلتر محصولات</h3>
          <button
            type="button"
            className="shop-drawer-close"
            onClick={onClose}
            aria-label="بستن"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="shop-drawer-body">
          <FilterPanel {...filterPanelProps} />
          <button
            type="button"
            className="shop-drawer-apply"
            onClick={onClose}
          >
            اعمال فیلترها
          </button>
        </div>
      </div>
    </>
  );
}
