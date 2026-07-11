// app/shop/page.tsx — Server Component
import ShopClientShell from '@/components/shop/ShopClientShell';
import '@/styles/components/shop.css';

export const metadata = {
  title: 'فروشگاه | الکتریکی آنلاین',
  description: 'خرید آنلاین لوازم برقی، لامپ، کلید، ابزار و کابل',
};

export default function ShopPage() {
  return <ShopClientShell />;
}
