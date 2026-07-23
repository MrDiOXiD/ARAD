'use client';

import { useState } from 'react';
import { SellerInfo } from '@/interfaces/product/types';
import { formatPrice, formatRating, toPersianDigits } from '@/utils/formats/numbers';
import { IconCheck } from './icons/icons'; // Make sure this path matches your project
import { useAppDispatch } from '@/store-redux/hooks';
import { addToCart } from '@/store-redux/features/cart/cartSlice';

interface ProductBuyBoxProps {
  id: string | number;
  title: string;
  brand?: string | null;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  currency?: string;
  maxQty?: number;
  perks: string[];
  sellerInfo: SellerInfo;
  onBuyNow?: (qty: number) => void;
}

export default function ProductBuyBox({
  id,
  title,
  brand,
  price,
  oldPrice,
  discountPercent,
  currency = 'تومان',
  maxQty = 10,
  perks,
  sellerInfo,
  onBuyNow,
}: ProductBuyBoxProps) {
  
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const saving = oldPrice ? oldPrice - price : 0;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(maxQty, q + 1));

 const handleAddToCart = () => {
  dispatch(addToCart({
    id: Number(id),
    title,
    icon: '🛒',
    unitPrice: price,
    quantity: qty,
    tags: brand ? [{ label: `برند: ${brand}` }] : [],
  }));

  setAdded(true);
  window.setTimeout(() => setAdded(false), 1600);
};

  return (
    <div className="prd-buybox">
      <div className="prd-price-label">قیمت فروش</div>
      {oldPrice && <div className="prd-old-price">{formatPrice(oldPrice)} {currency}</div>}

      <div className="prd-price-line">
        {discountPercent && <span className="prd-badge prd-badge--discount">٪{toPersianDigits(discountPercent)}</span>}
        <span className="prd-price-now">
          {formatPrice(price)}
          <span className="prd-toman">{currency}</span>
        </span>
      </div>

      {saving > 0 && <div className="prd-saving">صرفه‌جویی {formatPrice(saving)} {currency}</div>}

      <div className="prd-qty-row">
        <span className="prd-qty-label">تعداد:</span>
        <div className="prd-stepper">
          <button type="button" onClick={inc} disabled={qty >= maxQty} aria-label="افزایش تعداد">
            +
          </button>
          <span className="prd-qty-val">{toPersianDigits(qty)}</span>
          <button type="button" onClick={dec} disabled={qty <= 1} aria-label="کاهش تعداد">
            −
          </button>
        </div>
      </div>
      <div className="prd-qty-max">حداکثر {toPersianDigits(maxQty)} عدد</div>

      <button type="button" className="prd-btn prd-btn--primary" onClick={() => onBuyNow?.(qty)}>
        خرید فوری
      </button>

      <button
        type="button"
        className={`prd-btn prd-btn--secondary${added ? ' prd-btn--added' : ''}`}
        onClick={handleAddToCart}
      >
        {added ? (
          <>
            <IconCheck width={16} height={16} style={{ animation: 'prd-pop 0.4s ease' }} />
            افزوده شد
          </>
        ) : (
          'افزودن به سبد خرید'
        )}
      </button>

      <ul className="prd-perks">
        {perks.map((perk) => (
          <li key={perk}>
            <IconCheck />
            {perk}
          </li>
        ))}
      </ul>

      <div className="prd-seller-box">
        <div className="prd-label">فروشنده:</div>
        <div className="prd-seller-card">
          <div className="prd-seller-logo" />
          <div>
            <div className="prd-seller-name">{sellerInfo.name}</div>
            <div className="prd-seller-meta">
              {formatRating(sellerInfo.rating)} ★ — {toPersianDigits(sellerInfo.salesCount)} فروش موفق
            </div>
          </div>
        </div>
        <a className="prd-seller-link" href={sellerInfo.href ?? '#'}>
          محصولات فروشنده
        </a>
      </div>
    </div>
  );
}