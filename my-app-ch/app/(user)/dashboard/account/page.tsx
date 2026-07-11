// app/dashboard/account/page.tsx — Server Component
import '@/styles/components/dashboard/dashboard.css';
import '@/styles/components/dashboard/account.css';

import Link from 'next/link';

import AccountInfoForm from '../../../../components/dashboard/account/AccountInfoForm';
import ChangePasswordForm from '../../../../components/dashboard/account/ChangePasswordForm';
import LogoutButton from '../../../../components/dashboard/account/LogoutButton';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { CURRENT_USER } from '@/utils/mockData/dashboardData';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export const metadata = {
  title: 'اطلاعات حساب کاربری | الکتریکی آنلاین',
};

export default function AccountPage() {
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
          {/* Breadcrumb */}
          <nav className="ac-breadcrumb" aria-label="مسیر صفحه">
            <Link href="/dashboard">پنل کاربری</Link>
            <i className="bi bi-chevron-left" />
            <span>اطلاعات حساب کاربری</span>
          </nav>

          {/* Two cards side by side */}
          <div className="ac-grid">
            <AccountInfoForm />
            <ChangePasswordForm />
          </div>

          {/* Logout */}
          <LogoutButton />
        </main>
      </div>
    </div>
  );
}
