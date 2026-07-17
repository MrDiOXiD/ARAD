import HeroBanner from '@/components/HeroBanner';
import ProductSection from '@/components/product/ProductSection';
import { Product } from '@/components/product/ProductCard';
import { cacheLife } from 'next/cache'
import { cookies } from 'next/headers';


/* ── Mock data — replace with your real API/DB calls ── */
const latestProducts: Product[] = [
  { id: 1,  title: 'لامپ LED حبابی ۹ وات پارس شهاب',      price: '۴۵,۰۰۰',  oldPrice: '۵۸,۰۰۰',  badge: 'جدید', icon: 'bi-lightbulb'      },
  { id: 2,  title: 'کلید تبدیل دو پل ویسمن سری آرا',       price: '۱۲۸,۰۰۰', oldPrice: '۱۵۵,۰۰۰', badge: 'جدید', icon: 'bi-toggle-on'      },
  { id: 3,  title: 'پریز دوشاخه شوکو اسنوا مدل آرتمیس',   price: '۸۹,۵۰۰',  oldPrice: '۱۱۰,۰۰۰', badge: 'جدید', icon: 'bi-plug'           },
  { id: 4,  title: 'سیم برق افشان ۱.۵ میلی‌متر فاراد',     price: '۲۳۰,۰۰۰', oldPrice: '۲۸۰,۰۰۰', badge: 'جدید', icon: 'bi-ethernet'       },
  { id: 5,  title: 'دریل پیچ‌گوشتی شارژی بوش GSR 120-Li', price: '۳,۴۴۸,۹۰۰', oldPrice: '۳,۹۰۰,۰۰۰', badge: 'جدید', icon: 'bi-tools'  },
  { id: 6,  title: 'تابلو برق ۱۸ فاز فلزی ایران‌الکتریک',  price: '۸۵۰,۰۰۰', oldPrice: '۱,۰۵۰,۰۰۰', badge: 'جدید', icon: 'bi-grid-3x3'  },
  { id: 7,  title: 'فیوز مینیاتوری ۱۶ آمپر ABB تک‌فاز',   price: '۱۸۵,۰۰۰', oldPrice: '۲۳۰,۰۰۰', badge: 'جدید', icon: 'bi-shield-check'  },
  { id: 8,  title: 'ترموستات دیجیتال هوشمند هانتر',        price: '۵۶۰,۰۰۰', oldPrice: '۶۸۰,۰۰۰', badge: 'جدید', icon: 'bi-thermometer'   },
];

const featuredProducts: Product[] = [
  { id: 11, title: 'پنل خورشیدی ۱۰۰ وات مونوکریستال',      price: '۴,۲۰۰,۰۰۰', oldPrice: '۵,۱۰۰,۰۰۰', badge: 'جدید', icon: 'bi-sun'           },
  { id: 12, title: 'کابل شبکه CAT6 لگراند ۳۰۵ متر',        price: '۱,۸۵۰,۰۰۰', oldPrice: '۲,۲۰۰,۰۰۰', badge: 'جدید', icon: 'bi-hdd-network'   },
  { id: 13, title: 'موتور گیت اتوماتیک رام مدل ROGER',      price: '۸,۵۰۰,۰۰۰', badge: 'جدید',           icon: 'bi-gate'          },
  { id: 14, title: 'لامپ سیلد بیم LED 30W ویسمن',           price: '۳۲۰,۰۰۰',  oldPrice: '۴۱۰,۰۰۰', badge: 'جدید', icon: 'bi-spotlight'     },
  { id: 15, title: 'برکر اتوماتیک ۳۲ آمپر زیمنس',           price: '۵۴۰,۰۰۰',  oldPrice: '۶۵۰,۰۰۰', badge: 'جدید', icon: 'bi-lightning'     },
  { id: 16, title: 'دوربین مداربسته بولت AHD 2MP',          price: '۱,۱۵۰,۰۰۰', oldPrice: '۱,۴۰۰,۰۰۰', badge: 'جدید', icon: 'bi-camera-video' },
  { id: 17, title: 'ترانسفورماتور ۵ کیلووات ایران‌ترانسفو', price: '۶,۲۰۰,۰۰۰', badge: 'جدید',           icon: 'bi-cpu'           },
  { id: 18, title: 'هود آشپزخانه دیواری 90 اسنوا',          price: '۴,۸۰۰,۰۰۰', oldPrice: '۵,۵۰۰,۰۰۰', badge: 'جدید', icon: 'bi-wind'         },
  { id: 19, title: 'اینورتر خورشیدی ۵ کیلووات سانتک',       price: '۱۲,۵۰۰,۰۰۰', badge: 'جدید',          icon: 'bi-battery-charging' },
  { id: 20, title: 'سینی کابل گالوانیزه ۱۰۰×۵۰ میلی‌متر',  price: '۲۸۵,۰۰۰',  oldPrice: '۳۴۰,۰۰۰', badge: 'جدید', icon: 'bi-dash-lg'      },
  { id: 21, title: 'آنتن دیجیتال داخلی تقویت‌دار پارسان',  price: '۴۸۰,۰۰۰',  oldPrice: '۵۸۰,۰۰۰', badge: 'جدید', icon: 'bi-broadcast'    },
  { id: 22, title: 'کلید هوشمند وای‌فای سونوف مدل T3',     price: '۷۹۰,۰۰۰',  oldPrice: '۹۵۰,۰۰۰', badge: 'جدید', icon: 'bi-phone'        },
];

export default async function HomePage() {
  //  'use cache'
  // cacheLife('hours')


 const getFetchUnauth = async (url:any) => {
  const res = await fetch(`${"http://localhost:3020"}${url}`, {
    cache: "no-store", // Ensures Next.js bypasses caching and fetches fresh live data from Postgres
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch: ${res.status}`);
  }

  return await res.json();
};
const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
const categories = await getFetchUnauth("/categories");  return (
   
      <main>
        <HeroBanner />
        <div>
          <h2>testing all around panel admin database backend and the site</h2>
          <div>
        {categories.map((category:any) => (//the type should be identical to its dto
          <p key={category.id}>{category.title}و {category.description}</p>
        ))}
      </div>
        </div>
        <ProductSection title="جدیدترین‌ها"    products={latestProducts}  scroll />
        <ProductSection title="کالاهای منتخب"  products={featuredProducts} />
      </main>
   
  );
}
