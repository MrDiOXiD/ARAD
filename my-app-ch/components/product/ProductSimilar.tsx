import type { SimilarProduct } from '@/interfaces/product/types';
import SimilarProductCard from '@/components/product/SimilarproductCard ';

interface ProductSimilarProps {
  products: SimilarProduct[];
  viewAllHref?: string;
  onAdd?: (id: string) => void;
}

export default function ProductSimilar({ products, viewAllHref = '#', onAdd }: ProductSimilarProps) {
  if (products.length === 0) return null;

  return (
    <section className="prd-card prd-similar">
      <div className="prd-similar-header">
        <h2>محصولات مشابه</h2>
        <a className="prd-view-all" href={viewAllHref}>
          مشاهده همه
        </a>
      </div>

      <div className="prd-similar-grid">
        {products.map((product, i) => (
          <div
            key={product.id}
            style={{ animation: `prd-rise 0.4s cubic-bezier(.22,1,.36,1) both`, animationDelay: `${i * 0.05}s` }}
          >
            <SimilarProductCard product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}
