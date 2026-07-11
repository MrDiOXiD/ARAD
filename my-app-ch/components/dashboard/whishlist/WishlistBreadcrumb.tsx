import Link from 'next/link';

export default function WishlistBreadcrumb() {
  return (
    <nav className="wl-breadcrumb" aria-label="مسیر صفحه" dir="rtl">
      <Link href="/dashboard" className="wl-breadcrumb__link">
        پنل کاربری
      </Link>
      <i className="bi bi-chevron-left wl-breadcrumb__sep" aria-hidden="true" />
      <span className="wl-breadcrumb__active" aria-current="page">
        علاقه‌مندی‌ها
      </span>
    </nav>
  );
}
