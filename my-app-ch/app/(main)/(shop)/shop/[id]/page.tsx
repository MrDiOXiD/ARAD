'use client';

import { useParams } from 'next/navigation';

import ProductBuyBox from "@/components/product/ProductBuyBox";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ProductTrustBar from "@/components/product/ProductTrustBar";

import { useProduct } from '@/hooks/reactQuery/useProducts';
import { useAddToCart } from '@/hooks/useAddToCart';

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

const getBadgeVariant = (badge: string): 'discount' | 'new' | 'bestseller' => {
  if (badge === 'discount' || badge === 'new' || badge === 'bestseller') return badge;
  return 'new';
};

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: apiData, isLoading, isError } = useProduct(id);

  // ✅ Redux cart hook — replaces the old console.log stubs
  const { handleAddToCart } = useAddToCart();

  if (isLoading) {
    return (
      <div className="prd-page flex justify-center items-center min-h-[50vh]" dir="rtl">
        <p className="text-gray-500">در حال بارگذاری اطلاعات محصول...</p>
      </div>
    );
  }

  if (isError || !apiData) {
    return (
      <div className="prd-page flex justify-center items-center min-h-[50vh]" dir="rtl">
        <p className="text-red-500">محصول یافت نشد یا خطایی رخ داده است.</p>
      </div>
    );
  }

  // ── Data mapping ────────────────────────────────────────────────────────
  const numericPrice = Number(apiData.price);
  const numericDiscount = Number(apiData.discount || '0');
  const oldPrice =
    numericDiscount > 0
      ? Math.round(numericPrice / (1 - numericDiscount / 100))
      : undefined;

  const images = [
    { id: 'main', src: apiData.productImage || '/placeholder.jpg', alt: apiData.title },
    ...(apiData.gallery || []).map((imgUrl: string, idx: number) => ({
      id: `gal-${idx}`,
      src: imgUrl,
      alt: `${apiData.title} - تصویر ${idx + 1}`,
    })),
  ];

  const badges = apiData.badge
    ? [{ label: apiData.badge === 'new' ? 'جدید' : apiData.badge, variant: getBadgeVariant(apiData.badge) }]
    : [];

  const specGroups =
    apiData.attributes && Object.keys(apiData.attributes).length > 0
      ? [
        {
          title: 'مشخصات کلی',
          rows: Object.entries(apiData.attributes).map(([label, value]) => ({
            label,
            value: String(value),
          })),
        },
      ]
      : [];

  const inStock = apiData.stock > 0;
  const highDemand = inStock && apiData.stock <= 5;
  const sellerInfo = { name: 'فروشگاه', rating: 5, salesCount: 0, href: '/' };
  const perks = ['ارسال سریع', 'پرداخت امن', 'ضمانت اصالت کالا'];

  return (
    <div className="prd-page" dir="rtl">
      <div className="prd-container">
        <section className="prd-hero">
          <ProductGallery images={images} badges={badges} />

          <ProductInfo
            seller="فروشگاه اصلی"
            sku={`SKU-${apiData.id}`}
            title={apiData.title}
            titleHighlight={apiData.brand || undefined}
            rating={0}
            reviewCount={0}
            salesCount={0}
            inStock={inStock}
            stockLeft={apiData.stock}
            highDemand={highDemand}
            colors={[]}
            types={[]}
            warrantyLabel="تضمین سلامت فیزیکی کالا"
          />

          <ProductBuyBox
            id={apiData.id}
            title={apiData.title}
            brand={apiData.brand ?? undefined}
            price={numericPrice}
            oldPrice={oldPrice}
            discountPercent={numericDiscount || undefined}
            currency="تومان"
            maxQty={apiData.stock}
            perks={perks}
            sellerInfo={sellerInfo}
            onBuyNow={(qty) => handleAddToCart(apiData, qty)}
          />
        </section>

        <ProductTrustBar items={defaultTrustItems} />

        <ProductTabs
          specGroups={specGroups}
          reviewsCount={0}
          qaCount={0}
          description={apiData.description || 'توضیحاتی ثبت نشده است.'}
        />
      </div>
    </div>
  );
}
