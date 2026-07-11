// app/dashboard/wishlist/page.tsx — Server Component
//
// Reuses from the existing dashboard:
//   DashboardHeader   → @/app/dashboard/components/DashboardHeader
//   DashboardSidebar  → @/app/dashboard/components/DashboardSidebar
//   CURRENT_USER      → @/app/dashboard/data/dashboardData
//
// New (this folder only):
//   WishlistBreadcrumb, WishlistClientShell

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WishlistBreadcrumb from '@/components/dashboard/whishlist/WishlistBreadcrumb';
import WishlistClientShell from '@/components/dashboard/whishlist/WishlistClientShell';
import '@/styles/components/dashboard/dashboard.css';
import '@/styles/components/dashboard/wishlist.css';
import { CURRENT_USER } from '@/utils/mockData/dashboardData';



export const metadata = {
  title: 'علاقه‌مندی‌ها | الکتریکی آنلاین',
  description: 'لیست محصولات مورد علاقه شما',
};

export default function WishlistPage() {
  return (
    <div className="db-page" dir="rtl">
      <DashboardHeader
        userName={`${CURRENT_USER.name} رضایی`}
        avatarInitial={CURRENT_USER.avatarInitial}
        cartCount={2}
        notifCount={1}
      />

      <div className="db-layout">
        <DashboardSidebar />

        <main className="db-main">
          <WishlistBreadcrumb />
          <WishlistClientShell />
        </main>
      </div>
    </div>
  );
}
