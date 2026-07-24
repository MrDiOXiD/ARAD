import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';  // ← swap <link> for this
import '@/styles/globals.css';
import Goftino from '@/components/goftino/Goftino';
import QueryProvider from '@/hooks/reactQuery/provider-reactQuery/QueryProvider';
import StoreProvider from '@/store-redux/StoreProvider';
import { Suspense } from 'react';

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'الکتریکی آنلاین',
  description: 'فروشگاه آنلاین لوازم برقی',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        className="bg-gray-100 min-h-screen"
        style={{ fontFamily: 'var(--font-vazirmatn), sans-serif', margin: 0 }}
      >
        <Suspense fallback={null}>

        <StoreProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </StoreProvider>
        </Suspense>
        <Goftino />
      </body>
    </html>
  );
}