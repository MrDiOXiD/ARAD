import { ShopProduct } from '@/interfaces/shop/types';
import StarRating from './StarRating';
import { BADGE_LABEL } from '@/utils/mockData/shopData';
import Link from 'next/link';
import { useAddShopProductToCart } from '@/hooks/useAddShopProductToCart'; // ← add

interface ProductCardProps {
  product: ShopProduct;
  animationDelay?: number;
}

export default function ProductCard({ product, animationDelay }: ProductCardProps) {
  const { id, badge, icon, brand, title, rating, reviews, oldPrice, price, discount } = product;
  const { handleAddToCart } = useAddShopProductToCart(); // ← add

  const formattedPrice = Number(price).toLocaleString();

  return (
    <article className="shop-card" style={{ animationDelay: `${animationDelay}ms` }}>
      <Link href={`/shop/${id}`}>
        <div className="shop-card-img">
          {badge && (
            <span className={`shop-badge shop-badge--${badge}`}>
              {BADGE_LABEL[badge]}
            </span>
          )}
          <button className="shop-wish-btn" aria-label="افزودن به علاقه‌مندی">
            <i className="bi bi-heart" />
          </button>
          <img
            src={icon}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            className="shop-card-icon"
          />
        </div>
      </Link>

      <div className="shop-card-body">
        <div className="shop-card-brand">{brand}</div>
        <p className="shop-card-title">{title}</p>

        <StarRating rating={rating ?? 0} reviews={reviews} /> {/* ← fix */}

        {oldPrice && (
          <span className="shop-card-old-price">{Number(oldPrice).toLocaleString()} تومان</span>
        )}

        <div className="shop-card-price-row">
          <span className="shop-card-price">{formattedPrice}</span>
          <span className="shop-card-currency">تومان</span>
        </div>

        {discount && <span className="shop-card-discount">{discount}%</span>}

        {/* ← was: no onClick. Now dispatches to Redux */}
        <button
          type="button"
          className="shop-add-btn"
          onClick={() => handleAddToCart(product)}
        >
          <i className="bi bi-cart-plus" /> افزودن به سبد
        </button>
      </div>
    </article>
  );
}