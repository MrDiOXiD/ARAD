import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';

interface Props {
  title: string;
  products: Product[];
  scroll?: boolean;   // true = horizontal scroll row, false = grid
}

export default function ProductSection({ title, products, scroll = false }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" dir="rtl">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="section-header">
          <div className="section-title">
            <span className="section-title-dot" />
            {title}
          </div>
          <Link href="/shop" className="section-view-all">
            نمایش همه
            <i className="bi bi-arrow-left text-xs" />
          </Link>
        </div>

        {scroll ? (
          <div className="products-scroll">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
