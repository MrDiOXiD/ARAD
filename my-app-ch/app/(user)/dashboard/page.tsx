// app/dashboard/page.tsx — Server Component
import '@/styles/components/dashboard/dashboard.css';

import { CURRENT_USER } from '../../../utils/mockData/dashboardData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import RecentOrders from '@/components/dashboard/RecentOrders';

export const metadata = {
  title: 'پنل کاربری | الکتریکی آنلاین',
  description: 'مدیریت سفارشات، آدرس‌ها و اطلاعات حساب کاربری',
};

export default function DashboardPage() {
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
          <WelcomeBanner
            userName={CURRENT_USER.name}
            memberSince={CURRENT_USER.memberSince}
          />
          <RecentOrders />
        </main>
      </div>
    </div>
  );
}
