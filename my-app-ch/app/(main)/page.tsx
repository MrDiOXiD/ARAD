import HeroBanner from '@/components/HeroBanner';
import ProductSection from '@/components/product/ProductSection';
import { Product } from '@/components/product/ProductCard';

const latestProducts: Product[] = [
  { id: 1,  title: 'لامپ LED حبابی ۹ وات پارس شهاب',      price: '45000',   oldPrice: '58000',   badge: 'new', icon: 'bi-lightbulb'   },
  { id: 2,  title: 'کلید تبدیل دو پل ویسمن سری آرا',       price: '128000',  oldPrice: '155000',  badge: 'new', icon: 'bi-toggle-on'   },
  { id: 3,  title: 'پریز دوشاخه شوکو اسنوا مدل آرتمیس',   price: '89500',   oldPrice: '110000',  badge: 'new', icon: 'bi-plug'        },
  { id: 4,  title: 'سیم برق افشان ۱.۵ میلی‌متر فاراد',     price: '230000',  oldPrice: '280000',  badge: 'new', icon: 'bi-ethernet'    },
  { id: 5,  title: 'دریل پیچ‌گوشتی شارژی بوش GSR 120-Li', price: '3448900', oldPrice: '3900000', badge: 'new', icon: 'bi-tools'       },
  { id: 6,  title: 'تابلو برق ۱۸ فاز فلزی ایران‌الکتریک',  price: '850000',  oldPrice: '1050000', badge: 'new', icon: 'bi-grid-3x3'   },
  { id: 7,  title: 'فیوز مینیاتوری ۱۶ آمپر ABB تک‌فاز',   price: '185000',  oldPrice: '230000',  badge: 'new', icon: 'bi-shield-check'},
  { id: 8,  title: 'ترموستات دیجیتال هوشمند هانتر',        price: '560000',  oldPrice: '680000',  badge: 'new', icon: 'bi-thermometer' },
];

const featuredProducts: Product[] = [
  { id: 11, title: 'پنل خورشیدی ۱۰۰ وات مونوکریستال',      price: '4200000',  oldPrice: '5100000', badge: 'new', icon: 'bi-sun'            },
  { id: 12, title: 'کابل شبکه CAT6 لگراند ۳۰۵ متر',        price: '1850000',  oldPrice: '2200000', badge: 'new', icon: 'bi-hdd-network'    },
  { id: 13, title: 'موتور گیت اتوماتیک رام مدل ROGER',      price: '8500000',                       badge: 'new', icon: 'bi-gate'           },
  { id: 14, title: 'لامپ سیلد بیم LED 30W ویسمن',           price: '320000',   oldPrice: '410000',  badge: 'new', icon: 'bi-spotlight'      },
  { id: 15, title: 'برکر اتوماتیک ۳۲ آمپر زیمنس',           price: '540000',   oldPrice: '650000',  badge: 'new', icon: 'bi-lightning'      },
  { id: 16, title: 'دوربین مداربسته بولت AHD 2MP',          price: '1150000',  oldPrice: '1400000', badge: 'new', icon: 'bi-camera-video'   },
  { id: 17, title: 'ترانسفورماتور ۵ کیلووات ایران‌ترانسفو', price: '6200000',                       badge: 'new', icon: 'bi-cpu'            },
  { id: 18, title: 'هود آشپزخانه دیواری 90 اسنوا',          price: '4800000',  oldPrice: '5500000', badge: 'new', icon: 'bi-wind'           },
  { id: 19, title: 'اینورتر خورشیدی ۵ کیلووات سانتک',       price: '12500000',                      badge: 'new', icon: 'bi-battery-charging'},
  { id: 20, title: 'سینی کابل گالوانیزه ۱۰۰×۵۰ میلی‌متر',  price: '285000',   oldPrice: '340000',  badge: 'new', icon: 'bi-dash-lg'        },
  { id: 21, title: 'آنتن دیجیتال داخلی تقویت‌دار پارسان',  price: '480000',   oldPrice: '580000',  badge: 'new', icon: 'bi-broadcast'      },
  { id: 22, title: 'کلید هوشمند وای‌فای سونوف مدل T3',     price: '790000',   oldPrice: '950000',  badge: 'new', icon: 'bi-phone'          },
];

export default async function HomePage() {
  return (
    <main>
      <HeroBanner />
      <ProductSection title="جدیدترین‌ها"   products={latestProducts}   scroll />
      <ProductSection title="کالاهای منتخب" products={featuredProducts} />
    </main>
  );
}