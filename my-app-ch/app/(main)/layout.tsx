import type { Metadata } from 'next';
import '../../styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileTabBar from '@/components/MobileTabBar';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'الکتریکی آنلاین',
  description: 'فروشگاه آنلاین لوازم برقی',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
   
 <>
      <Header />
      {/* pb-16 keeps content clear of the fixed mobile tab bar below;
          not needed on sm+ since that bar only renders under sm. */}
      <div className="pb-16 sm:pb-0">
        <Suspense>
          {children}
        </Suspense>
        <Footer />
      </div>
      <MobileTabBar />
 </>
 
  );
}
