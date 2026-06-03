import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'الکتریکی آنلاین',
  description: 'فروشگاه آنلاین لوازم برقی',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Fallback: also load font via link tag in case @import gets blocked */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'Vazirmatn, sans-serif', margin: 0, background: '#f0f0f0', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
