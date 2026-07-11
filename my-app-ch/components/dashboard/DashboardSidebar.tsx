'use client';

import { NAV_ITEMS } from '@/utils/mockData/dashboardData';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="db-sidebar" aria-label="پنل کاربری">
      <h2 className="db-sidebar__title">پنل کاربری</h2>
      <nav>
        <ul className="db-sidebar__nav" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const isLogout = item.id === 'logout';

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={[
                    'db-sidebar__link',
                    isActive    ? 'db-sidebar__link--active'  : '',
                    isLogout    ? 'db-sidebar__link--logout'  : '',
                  ].filter(Boolean).join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <i className={`bi ${item.icon} db-sidebar__icon`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
