import Link from 'next/link';

interface DashboardHeaderProps {
  userName: string;
  avatarInitial: string;
  cartCount?: number;
  notifCount?: number;
}

export default function DashboardHeader({
  userName,
  avatarInitial,
  cartCount = 2,
  notifCount = 1,
}: DashboardHeaderProps) {
  return (
    <header className="db-header" dir="rtl">
      <div className="db-header__inner">
        {/* Logo */}
        <Link href="/" className="db-header__logo" aria-label="الکتریکی آنلاین">
          <span className="db-header__logo-icon">E</span>
          <span className="db-header__logo-text">الکتریکی آنلاین</span>
        </Link>

        {/* Right-side actions */}
        <div className="db-header__actions">
          {/* Cart */}
          <Link href="/cart" className="db-header__action-btn" aria-label={`سبد خرید — ${cartCount} آیتم`}>
            <i className="bi bi-cart2" />
            {cartCount > 0 && (
              <span className="db-header__badge">{cartCount}</span>
            )}
          </Link>

          {/* Notifications */}
          <button type="button" className="db-header__action-btn" aria-label={`اعلان‌ها — ${notifCount} جدید`}>
            <i className="bi bi-bell" />
            {notifCount > 0 && (
              <span className="db-header__badge">{notifCount}</span>
            )}
          </button>

          {/* User */}
          <button type="button" className="db-header__user">
            <span className="db-header__user-name">{userName}</span>
            <i className="bi bi-chevron-down db-header__chevron" />
            <div className="db-header__avatar" aria-hidden="true">
              {avatarInitial}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
