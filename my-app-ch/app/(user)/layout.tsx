import type { Metadata } from 'next';
import '../../styles/globals.css';


export const metadata: Metadata = {
  title: 'الکتریکی آنلاین',
  description: 'فروشگاه آنلاین لوازم برقی',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (

      < >
        {children}
      </>
  
  );
}
