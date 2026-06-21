
import { SimilarProduct } from '@/interfaces/product/types';
import { IconPlaceholder } from '@/components/icons/icons';
import { formatPrice, starString, toPersianDigits } from '@/utils/formats/numbers';

interface SimilarProductCardProps {
  product: SimilarProduct;
  onAdd?: (id: string) => void;
}

export default function SimilarProductCard({ product, onAdd }: SimilarProductCardProps) {
  return (
    <a className="prd-card product-card" href={product.href ?? '#'}>
      <div className="prd-pc-badge-row">
        {product.badge && <span className={`prd-badge prd-badge--${product.badge.variant}`}>{product.badge.label}</span>}
      </div>

      <div className="prd-pc-image">
        {product.image?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image.src} alt={product.image.alt} />
        ) : (
          <IconPlaceholder />
        )}
      </div>

      <div className="prd-pc-seller">{product.seller}</div>
      <div className="prd-pc-title">{product.title}</div>

      <div className="prd-pc-rating">
        <span className="prd-stars">{starString(product.rating)}</span>
        <span>({toPersianDigits(product.reviewCount)})</span>
      </div>

      {product.oldPrice && <div className="prd-pc-old">{formatPrice(product.oldPrice)} تومان</div>}

      <div className="prd-pc-price-row">
        <span className="prd-pc-price">{formatPrice(product.price)} تومان</span>
        {product.discountPercent && (
          <span className="prd-pc-discount">٪{toPersianDigits(product.discountPercent)}</span>
        )}
      </div>

      <div className="prd-pc-add">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onAdd?.(product.id);
          }}
        >
          افزودن
        </button>
      </div>
    </a>
  );
}
