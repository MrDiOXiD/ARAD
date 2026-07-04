import Link from 'next/link';

const CRUMBS = [
  { label: 'خانه', href: '/' },
  { label: 'سبد خرید', href: '/cart' },
  { label: 'مرور سبد', href: null },
] as const;

export default function CartBreadcrumb() {
  return (
    <nav aria-label="مسیر صفحه" className="cart-breadcrumb">
      {CRUMBS.map((crumb, index) => (
        <span key={crumb.label}>
          {index > 0 && (
            <span className="cart-breadcrumb__sep" aria-hidden="true">›</span>
          )}
          {crumb.href ? (
            <Link href={crumb.href} className="cart-breadcrumb__link">
              {crumb.label}
            </Link>
          ) : (
            <span className="cart-breadcrumb__active" aria-current="page">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
