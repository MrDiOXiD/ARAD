'use client';

import ProductBuyBox from "@/components/product/ProductBuyBox";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSimilar from "@/components/product/ProductSimilar";
import ProductTabs from "@/components/product/ProductTabs";
import ProductTrustBar from "@/components/product/ProductTrustBar";
import { ProductDetail } from "@/interfaces/product/types";



export const antennaProduct: ProductDetail = {
  id: "ant-001",
  sku: "ANT-WL-2024-001",
  seller: "فروشگاه الکترونیک آراد",
  title: "آنتن دیجیتال داخلی قوی با تقویت کننده سیگنال",
  titleHighlight: "مدل WL-2024",
  badges: [
    { label: "تخفیف ویژه", variant: "discount" },
    { label: "پرفروش", variant: "bestseller" },
  ],
  rating: 4.7,
  reviewCount: 128,
  salesCount: 342,
  inStock: true,
  stockLeft: 47,
  highDemand: true,
  images: [    { 
      id: "img-1", 
      src: "/images/products/antenna-1.jpg", 
      alt: "آنتن دیجیتال - نمای جلو" 
    },
    { 
      id: "img-2", 
      src: "/images/products/antenna-2.jpg", 
      alt: "آنتن دیجیتال - نمای عقب" 
    },
    { 
      id: "img-3", 
      src: "/images/products/antenna-3.jpg", 
      alt: "آنتن دیجیتال - جعبه" 
    },
    { 
      id: "img-4", 
      src: "/images/products/antenna-4.jpg", 
      alt: "آنتن دیجیتال - نصب" 
    },
  ],
  colors: [
    { id: "col-1", name: "سفید", hex: "#FFFFFF", bordered: true },
    { id: "col-2", name: "مشکی", hex: "#000000" },
    { id: "col-3", name: "نقره‌ای", hex: "#C0C0C0" },
  ],
  types: [
    { id: "type-1", label: "دیجیتال" },
    { id: "type-2", label: "آنالوگ" },
  ],
  warrantyLabel: "گارانتی ۱۸ ماهه",
  price: 1850000,
  oldPrice: 2350000,
  discountPercent: 21,
  currency: "تومان",
  maxQty: 10,
  perks: [
    "ارسال رایگان",
    "گارانتی ۱۸ ماهه",
    "بازگشت ۷ روزه",
    "نصب رایگان"
  ],
  sellerInfo: {
    name: "فروشگاه الکترونیک آراد",
    rating: 4.9,
    salesCount: 12450,
    href: "/sellers/arad-electronics",
  },
  specGroups: [
    {
      title: "مشخصات فنی",
      rows: [
        { label: "نوع آنتن", value: "دیجیتال داخلی" },
        { label: "فرکانس", value: "174-862 MHz" },
        { label: "باند", value: "UHF/VHF" },
        { label: "گین", value: "28 dBi" },
        { label: "امپدانس", value: "75 اهم" },
        { label: "طول کابل", value: "3 متر" },
        { label: "ابعاد", value: "25 × 15 × 5 سانتی‌متر" },
        { label: "وزن", value: "350 گرم" },
      ],
    },
    {
      title: "قابلیت‌ها",
      rows: [
        { label: "تقویت کننده", value: "دارد" },
        { label: "مناسب برای", value: "مناطق شهری و حومه" },
        { label: "نصب", value: "روی میز یا دیوار" },
        { label: "تعداد کانال", value: "بیش از ۵۰ کانال" },
        { label: "کیفیت تصویر", value: "Full HD (1080p)" },
      ],
    },
  ],
  similarProducts: [
    {
      id: "ant-002",
      badge: { label: "پرفروش", variant: "bestseller" },
      seller: "فروشگاه دیجی‌کالا",
      title: "آنتن دیجیتال خارجی قوی",
      rating: 4.5,
      reviewCount: 89,
      price: 2150000,
      oldPrice: 2550000,
      discountPercent: 16,
      image: { 
        id: "sim-1", 
        src: "/images/products/antenna-2.jpg", 
        alt: "آنتن خارجی" 
      },
      href: "/shop/ant-002",
    },
    {
      id: "ant-003",
      badge: { label: "جدید", variant: "new" },
      seller: "فروشگاه الکترونیک آراد",
      title: "آنتن دیجیتال کوچک قابل حمل",
      rating: 4.2,
      reviewCount: 56,
      price: 950000,
      oldPrice: undefined,
      discountPercent: 0,
      image: { 
        id: "sim-2", 
        src: "/images/products/antenna-3.jpg", 
        alt: "آنتن قابل حمل" 
      },
      href: "/shop/ant-003",
    },
    {
      id: "ant-004",
      badge: { label: "تخفیف ویژه", variant: "discount" },
      seller: "فروشگاه تکنو",
      title: "آنتن دیجیتال با تقویت کننده ۴G",
      rating: 4.8,
      reviewCount: 201,
      price: 2750000,
      oldPrice: 3150000,
      discountPercent: 13,
      image: { 
        id: "sim-3", 
        src: "/images/products/antenna-4.jpg", 
        alt: "آنتن ۴G" 
      },
      href: "/shop/ant-004",
    },
  ],
  reviewsCount: 128,
  qaCount: 23,
  description: "آنتن دیجیتال داخلی با قابلیت دریافت تمام کانال‌های دیجیتال با کیفیت Full HD. این آنتن با طراحی مدرن و نصب آسان، بهترین گزینه برای مناطقی است که سیگنال‌های دیجیتال ضعیف هستند. دارای تقویت کننده داخلی با قابلیت تنظیم دستی برای دریافت بهترین کیفیت تصویر.",
};

// You can also create additional sample products
export const sampleProducts: ProductDetail[] = [
  antennaProduct,
  // Add more products here...
];




interface ProductPageProps {
  antennaProduct: ProductDetail;
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

export default function ProductPage({ProductPageProps,  onAddToCart, onBuyNow, onAddSimilarToCart }: ProductPageProps) {
console.log(ProductPageProps);
 
  return (
    <div className="prd-page" dir="rtl">
      <div className="prd-container">
        <section className="prd-hero">
          <ProductGallery images={antennaProduct.images} badges={antennaProduct.badges} />

          <ProductInfo
            seller={antennaProduct.seller}
            sku={antennaProduct.sku}
            title={antennaProduct.title}
            titleHighlight={antennaProduct.titleHighlight}
            rating={antennaProduct.rating}
            reviewCount={antennaProduct.reviewCount}
            salesCount={antennaProduct.salesCount}
            inStock={antennaProduct.inStock}
            stockLeft={antennaProduct.stockLeft}
            highDemand={antennaProduct.highDemand}
            colors={antennaProduct.colors}
            types={antennaProduct.types}
            warrantyLabel={antennaProduct.warrantyLabel}
          />

          <ProductBuyBox
            price={antennaProduct.price}
            oldPrice={antennaProduct.oldPrice}
            discountPercent={antennaProduct.discountPercent}
            currency={antennaProduct.currency}
            maxQty={antennaProduct.maxQty}
            perks={antennaProduct.perks}
            sellerInfo={antennaProduct.sellerInfo}
            onAddToCart={(qty: number) => onAddToCart?.(antennaProduct.id, qty)}
            onBuyNow={(qty: number) => onBuyNow?.(antennaProduct.id, qty)}
          />
        </section>

        <ProductTrustBar items={defaultTrustItems} />

        <ProductTabs 
          specGroups={antennaProduct.specGroups}
          reviewsCount={antennaProduct.reviewsCount}
          qaCount={antennaProduct.qaCount}
          description={antennaProduct.description}
        />

        <ProductSimilar products={antennaProduct.similarProducts} onAdd={onAddSimilarToCart} />
      </div>
    </div>
  );
}
