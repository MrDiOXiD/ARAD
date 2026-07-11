'use client';

interface WishlistHeaderProps {
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function WishlistHeader({
  selectedCount,
  onDeleteSelected,
}: WishlistHeaderProps) {
  return (
    <div className="wl-header" dir="rtl">
      <div className="wl-header__title-group">
        <h1 className="wl-header__title">
          علاقه‌مندی‌ها
          <i className="bi bi-heart-fill wl-header__heart" aria-hidden="true" />
        </h1>
        <p className="wl-header__subtitle">
          محصولاتی که به آن‌ها علاقه‌مند هستید را در اینجا مشاهده و مدیریت کنید.
        </p>
      </div>

      <button
        type="button"
        className="wl-header__delete-btn"
        onClick={onDeleteSelected}
        disabled={selectedCount === 0}
        aria-label={`حذف ${selectedCount} مورد انتخاب شده`}
      >
        <i className="bi bi-trash" aria-hidden="true" />
        حذف انتخاب شده
      </button>
    </div>
  );
}
