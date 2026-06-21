'use client';

import { ProductBadge, ProductImage } from '@/interfaces/product/types';
import { useState } from 'react';
import { IconPlaceholder } from '../icons/icons';


interface ProductGalleryProps {
  images: ProductImage[];
  badges: ProductBadge[];
}

export default function ProductGallery({ images, badges }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="prd-gallery">
      {badges.length > 0 && (
        <div className="prd-gallery-badges">
          {badges.map((badge) => (
            <span key={badge.label} className={`prd-badge prd-badge--${badge.variant}`}>
              {badge.label}
            </span>
          ))}
        </div>
      )}

      <div className="prd-gallery-main">
        {active?.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.src} alt={active.alt} key={active.id} />
        ) : (
          <IconPlaceholder key={active?.id ?? 'placeholder'} />
        )}
      </div>

      {images.length > 1 && (
        <div className="prd-thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`prd-thumb${i === activeIndex ? ' prd-thumb--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={img.alt}
              aria-pressed={i === activeIndex}
            >
              {img.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.src} alt={img.alt} />
              ) : (
                <IconPlaceholder />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
