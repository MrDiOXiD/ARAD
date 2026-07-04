import { ShopProduct } from '@/interfaces/shop/types';
import StarRating from './StarRating';
import { BADGE_LABEL } from '@/utils/mockData/shopData';
import Link from 'next/link';


interface ProductCardProps {
  product: ShopProduct;
  animationDelay: number;
}

export default function ProductCard({ product, animationDelay }: ProductCardProps) {
  const { badge, icon, brand, title, rating, reviews, oldPrice, price, discount } = product;

  return (
    
    <article
      className="shop-card"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
    <Link href="shop/test">
      <div className="shop-card-img">
        {badge && (
          <span className={`shop-badge shop-badge--${badge}`}>
            {BADGE_LABEL[badge]}
          </span>
        )}
        <button className="shop-wish-btn" aria-label="افزودن به علاقه‌مندی">
          <i className="bi bi-heart" />
        </button>
        <i className={`bi ${icon} shop-card-icon`} />
      </div>
        </Link>

      <div className="shop-card-body">
        <div className="shop-card-brand">{brand}</div>
        <p className="shop-card-title">{title}</p>

        <StarRating rating={rating} reviews={reviews} />

        {oldPrice && (
          <span className="shop-card-old-price">{oldPrice} تومان</span>
        )}

        <div className="shop-card-price-row">
          <span className="shop-card-price">{price}</span>
          <span className="shop-card-currency">تومان</span>
        </div>

        {discount && (
          <span className="shop-card-discount">{discount}</span>
        )}

        <button type="button" className="shop-add-btn">
          <i className="bi bi-cart-plus" /> افزودن به سبد
        </button>
      </div>
    </article>

  );
}
