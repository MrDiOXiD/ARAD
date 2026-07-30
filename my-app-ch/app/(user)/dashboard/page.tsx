"use client"
import '@/styles/components/dashboard/dashboard.css';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import RecentOrders from '@/components/dashboard/RecentOrders';
import { useAuth } from '@/context/AuthContext';



export default function DashboardPage() {
  const { user, isBootstrapping } = useAuth();

console.log(user);


  if (!user) {
    return null;
  }

  return (
    <div className="db-page" dir="rtl">
        <DashboardHeader
        userName={user.username}
        avatarInitial={user.username.charAt(0).toUpperCase()}
        cartCount={2}
        notifCount={1}
      />

      <div className="db-layout">
        <DashboardSidebar />

        <main className="db-main">
          <WelcomeBanner
            userName={user.username}
            memberSince={user.createdAt}
          />
          <RecentOrders />
        </main>
      </div>
    </div>
  );
}
