'use client';

import { ProductDetail } from "@/interfaces/product/types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTrustBar from "./ProductTrustBar";
import ProductTabs from "./ProductTabs";
import ProductSimilar from "./ProductSimilar";
import ProductBuyBox from "./ProductBuyBox";


interface ProductPageProps {
  product: ProductDetail;
  onAddToCart?: (productId: string, qty: number) => void;
  onBuyNow?: (productId: string, qty: number) => void;
  onAddSimilarToCart?: (productId: string) => void;
}

const defaultTrustItems = [
  {
    icon: 'shield' as const,
    title: 'پرداخت امن',
    text: 'درگاه بانکی امن — پرداخت در محل، امکان پرداخت اقساطی با کارت',
    linkLabel: 'روش‌های پرداخت',
  },
  {
    icon: 'return' as const,
    title: 'ضمانت بازگشت',
    text: '۷ روز فرصت بازگشت بدون قید و شرط، هزینه ارسال برگشت رایگان است',
    linkLabel: 'قوانین بازگشت',
  },
  {
    icon: 'shipping' as const,
    title: 'ارسال سریع',
    text: 'تهران: ارسال همان روز (سفارش تا ۱۴:۰۰) — شهرستان: ۲ تا ۳ روز کاری',
    linkLabel: 'اطلاعات بیشتر',
  },
];

export default function ProductPage({ product, onAddToCart, onBuyNow, onAddSimilarToCart }: ProductPageProps) {
  return (
    <div className="prd-page" dir="rtl">
      <div className="prd-container">
        <section className="prd-hero">
          <ProductGallery images={product.images} badges={product.badges} />

          <ProductInfo
            seller={product.seller}
            sku={product.sku}
            title={product.title}
            titleHighlight={product.titleHighlight}
            rating={product.rating}
            reviewCount={product.reviewCount}
            salesCount={product.salesCount}
            inStock={product.inStock}
            stockLeft={product.stockLeft}
            highDemand={product.highDemand}
            colors={product.colors}
            types={product.types}
            warrantyLabel={product.warrantyLabel}
          />

          <ProductBuyBox
            price={product.price}
            oldPrice={product.oldPrice}
            discountPercent={product.discountPercent}
            currency={product.currency}
            maxQty={product.maxQty}
            perks={product.perks}
            sellerInfo={product.sellerInfo}
            onAddToCart={(qty: number) => onAddToCart?.(product.id, qty)}
            onBuyNow={(qty: number) => onBuyNow?.(product.id, qty)}
          />
        </section>

        <ProductTrustBar items={defaultTrustItems} />

        <ProductTabs
          specGroups={product.specGroups}
          reviewsCount={product.reviewsCount}
          qaCount={product.qaCount}
          description={product.description}
        />

        <ProductSimilar products={product.similarProducts} onAdd={onAddSimilarToCart} />
      </div>
    </div>
  );
}
