import Link from 'next/link';
import Image from 'next/image';

export interface Product {
  id: number;
  title: string;
  price: string;      // 🌟 Changed to string to match API ("20000.00")
  discount?: string;  // 🌟 Changed to string to match API ("0.00")
  oldPrice?: string; // 🌟 Add this line
  icon?: string;
  badge?: string | null; // Added null because your API sends null
  productImage?: string; 
}

export default function ProductCard({ product }: { product: Product }) {
  // 🌟 Safely convert API strings to numbers for math and formatting
  const numericPrice = Number(product.price);
  const numericDiscount = Number(product.discount || "0");

  const hasDiscount = numericDiscount > 0;
  
  const oldPrice = hasDiscount 
    ? Math.round(numericPrice / (1 - numericDiscount / 100)) 
    : null;

  return (
    <Link href={`/products/${product.id}`} className="product-card no-underline">
      <div className="product-card-img relative w-full h-48">
        {product.badge && <span className="product-badge absolute top-2 right-2 z-10">{product.badge}</span>}
        
        {product.productImage ? (
          <Image 
            src={product.productImage} 
            alt={product.title}
            fill
            className="object-cover rounded-t-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">بدون تصویر</span>
          </div>
        )}
      </div>

      <div className="product-card-body" dir="rtl">
        <p className="product-title">{product.title}</p>
        
        {hasDiscount && (
          <span className="product-old-price line-through text-gray-400 text-sm">
            {oldPrice?.toLocaleString()}
          </span>
        )}
        
        <div className="product-price-row flex gap-1 items-center">
          {/* 🌟 Now toLocaleString() will correctly output "20,000" */}
          <span className="product-price font-bold">{numericPrice.toLocaleString()}</span>
          <span className="product-currency text-xs">تومان</span>
        </div>
      </div>
    </Link>
  );
}