// app/dashboard/addresses/page.tsx — Server Component
import '@/styles/components/dashboard/dashboard.css';
import '@/styles/components/dashboard/addresses.css';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { CURRENT_USER } from '@/utils/mockData/dashboardData';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import AddressesClientShell from '@/components/dashboard/addresses/AddressesClientShell';


export const metadata = {
  title: 'آدرس‌ها | الکتریکی آنلاین',
  description: 'مدیریت آدرس‌های تحویل سفارش',
};

export default function AddressesPage() {
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
          <AddressesClientShell />
        </main>
      </div>
    </div>
  );
}
