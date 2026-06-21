'use client';

import { useState } from 'react';
import { formatRating, starString, toPersianDigits } from '@/utils/formats/numbers';
import { IconChevronDown, IconCompare } from '../icons/icons';
import { ColorSwatch, TypeOption } from '@/interfaces/product/types';


function renderTitle(title: string, highlight?: string) {
  if (!highlight) return title;
  const index = title.indexOf(highlight);
  if (index === -1) return title;
  const before = title.slice(0, index);
  const after = title.slice(index + highlight.length);
  return (
    <>
      {before}
      <b>{highlight}</b>
      {after}
    </>
  );
}

interface ProductInfoProps {
  seller: string;
  sku: string;
  title: string;
  titleHighlight?: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  inStock: boolean;
  stockLeft?: number;
  highDemand?: boolean;
  colors?: ColorSwatch[];
  types?: TypeOption[];
  warrantyLabel?: string;
  onColorChange?: (id: string) => void;
  onTypeChange?: (id: string) => void;
}

export default function ProductInfo({
  seller,
  sku,
  title,
  titleHighlight,
  rating,
  reviewCount,
  salesCount,
  inStock,
  stockLeft,
  highDemand,
  colors,
  types,
  warrantyLabel,
  onColorChange,
  onTypeChange,
}: ProductInfoProps) {
  const [activeColor, setActiveColor] = useState(colors?.[0]?.id ?? '');
  const [activeType, setActiveType] = useState(types?.find((t) => !t.disabled)?.id ?? '');

  const handleColor = (id: string) => {
    setActiveColor(id);
    onColorChange?.(id);
  };
  const handleType = (id: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveType(id);
    onTypeChange?.(id);
  };

  return (
    <div className="prd-info">
      <div className="prd-info-top">
        <span className="prd-seller-pill">{seller}</span>
        <span className="prd-sku">کد: {sku}</span>
      </div>

      <h1 className="prd-title">{renderTitle(title, titleHighlight)}</h1>

      <div className="prd-rating-row">
        <span className="prd-stars" aria-label={`امتیاز ${formatRating(rating)} از ۵`}>
          {starString(rating)}
        </span>
        <span className="prd-score">{formatRating(rating)}</span>
        <span className="prd-dot-sep">|</span>
        <span>{toPersianDigits(reviewCount)} نظر</span>
        <span className="prd-dot-sep">|</span>
        <span>{toPersianDigits(salesCount)} فروش</span>
      </div>

      <div className="prd-pill-row">
        {inStock && (
          <span className="prd-status-pill prd-status-pill--stock">
            <span className="prd-dot" /> موجود در انبار
          </span>
        )}
        {typeof stockLeft === 'number' && (
          <span className="prd-status-pill prd-status-pill--left">
            {toPersianDigits(stockLeft)} عدد باقی مانده
          </span>
        )}
        {highDemand && <span className="prd-status-pill prd-status-pill--demand">تقاضای بالا</span>}
      </div>

      {colors && colors.length > 0 && (
        <div className="prd-field">
          <div className="prd-field-label">رنگ:</div>
          <div className="prd-swatches">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`prd-swatch${c.id === activeColor ? ' prd-swatch--active' : ''}`}
                onClick={() => handleColor(c.id)}
                aria-pressed={c.id === activeColor}
              >
                <span className="prd-swatch-circle">
                  <span
                    className="prd-swatch-dot"
                    style={{
                      background: c.hex,
                      border: c.bordered ? '1px solid #ddd' : undefined,
                    }}
                  />
                </span>
                <span className="prd-swatch-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {types && types.length > 0 && (
        <div className="prd-field">
          <div className="prd-field-label">نوع:</div>
          <div className="prd-type-row">
            {types.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={t.disabled}
                className={[
                  'prd-type-btn',
                  t.id === activeType ? 'prd-type-btn--active' : '',
                  t.disabled ? 'prd-type-btn--disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleType(t.id, t.disabled)}
                aria-pressed={t.id === activeType}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {warrantyLabel && (
        <div className="prd-field">
          <div className="prd-field-label">گارانتی:</div>
          <button type="button" className="prd-select-fake">
            <IconChevronDown width={14} height={14} />
            <span>{warrantyLabel}</span>
          </button>
        </div>
      )}

      <a className="prd-compare-link" href="#">
        <IconCompare width={15} height={15} />
        افزودن به مقایسه
      </a>
    </div>
  );
}
