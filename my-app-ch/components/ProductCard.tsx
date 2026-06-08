import Link from 'next/link';

export interface Product {
  id: number;
  title: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  icon: string;         // bootstrap icon class — replace with <Image> when real images available
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href="#" className="product-card no-underline">
      <div className="product-card-img">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {/* Replace this icon placeholder with <Image> when real product images are available */}
        <i className={`bi ${product.icon} text-5xl text-gray-300`} />
      </div>
      <div className="product-card-body" dir="rtl">
        <p className="product-title">{product.title}</p>
        {product.oldPrice && <span className="product-old-price">{product.oldPrice}</span>}
        <div className="product-price-row">
          <span className="product-price">{product.price}</span>
          <span className="product-currency">تومان</span>
        </div>
      </div>
    </Link>
  );
}
