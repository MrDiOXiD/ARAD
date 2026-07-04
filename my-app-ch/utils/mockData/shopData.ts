import { Category, ShopProduct } from "@/interfaces/shop/types";

export const CATEGORIES: Category[] = [
  { id: 'all',      label: 'همه محصولات',   icon: 'bi-grid',              count: '۱۲۴' },
  { id: 'lighting', label: 'نور و روشنایی',  icon: 'bi-lightbulb',        count: '۳۸'  },
  { id: 'tools',    label: 'ابزار برقی',      icon: 'bi-tools',            count: '۲۲'  },
  { id: 'switches', label: 'کلید و پریز',     icon: 'bi-toggle-on',        count: '۱۹'  },
  { id: 'antenna',  label: 'آنتن',            icon: 'bi-broadcast',        count: '۱۱'  },
  { id: 'hvac',     label: 'تهویه',           icon: 'bi-thermometer-half', count: '۹'   },
  { id: 'cable',    label: 'سیم و کابل',      icon: 'bi-ethernet',         count: '۲۵'  },
];

export const BRANDS = ['پارس شهاب', 'ویسمن', 'بوش', 'اسنوا', 'لگراند', 'ABB'] as const;

export const SORT_OPTIONS = ['پرفروش‌ترین', 'جدیدترین', 'ارزان‌ترین', 'گران‌ترین'] as const;

export const TOTAL_PAGES = 13;
export const TOTAL_PRODUCTS = '۱۲۴';
export const PAGE_BUTTONS: (number | '...')[] = [1, 2, 3, 4, 5, '...', 12, 13];

export const BADGE_LABEL: Record<string, string> = {
  new: 'جدید',
  sale: 'تخفیف',
  hot: 'پرفروش',
};

export const PRODUCTS: ShopProduct[] = [
  { id: 1,  brand: 'پارس شهاب',     title: 'لامپ LED حبابی ۹ وات',             icon: 'bi-lightbulb-fill', badge: 'new',  rating: 5, reviews: '۱۲۴', oldPrice: '۵۸,۰۰۰',    price: '۴۵,۰۰۰',    discount: '۲۲٪ تخفیف' },
  { id: 2,  brand: 'ویسمن',         title: 'کلید تبدیل دو پل سری آرا',          icon: 'bi-toggle-on',      badge: 'sale', rating: 4, reviews: '۸۷',  oldPrice: '۱۵۵,۰۰۰',   price: '۱۲۸,۰۰۰',   discount: '۱۷٪ تخفیف' },
  { id: 3,  brand: 'اسنوا',         title: 'پریز دوشاخه شوکو مدل آرتمیس',       icon: 'bi-plug',           badge: 'new',  rating: 5, reviews: '۵۶',  oldPrice: '۱۱۰,۰۰۰',   price: '۸۹,۵۰۰',    discount: '۱۸٪ تخفیف' },
  { id: 4,  brand: 'فاراد',         title: 'سیم برق افشان ۱.۵ میلی‌متر',        icon: 'bi-ethernet',       badge: 'hot',  rating: 4, reviews: '۲۰۳', oldPrice: '۲۸۰,۰۰۰',   price: '۲۳۰,۰۰۰',   discount: '۱۸٪ تخفیف' },
  { id: 5,  brand: 'بوش',           title: 'دریل پیچ‌گوشتی شارژی GSR 120-Li',   icon: 'bi-tools',          badge: 'new',  rating: 5, reviews: '۳۱',  oldPrice: '۳,۹۰۰,۰۰۰', price: '۳,۴۴۸,۹۰۰', discount: '۱۱٪ تخفیف' },
  { id: 6,  brand: 'ایران‌الکتریک', title: 'تابلو برق ۱۸ فاز فلزی',             icon: 'bi-grid-3x3',                     rating: 4, reviews: '۱۴',  oldPrice: '۱,۰۵۰,۰۰۰', price: '۸۵۰,۰۰۰',   discount: '۱۹٪ تخفیف' },
  { id: 7,  brand: 'ABB',           title: 'فیوز مینیاتوری ۱۶ آمپر تک‌فاز',     icon: 'bi-shield-check',   badge: 'sale', rating: 5, reviews: '۴۵',  oldPrice: '۲۳۰,۰۰۰',   price: '۱۸۵,۰۰۰',   discount: '۲۰٪ تخفیف' },
  { id: 8,  brand: 'هانتر',         title: 'ترموستات دیجیتال هوشمند',           icon: 'bi-thermometer',    badge: 'new',  rating: 4, reviews: '۶۷',  oldPrice: '۶۸۰,۰۰۰',   price: '۵۶۰,۰۰۰',   discount: '۱۷٪ تخفیف' },
  { id: 9,  brand: 'سانتک',         title: 'پنل خورشیدی ۱۰۰ وات مونوکریستال',   icon: 'bi-sun',            badge: 'hot',  rating: 5, reviews: '۲۸',  oldPrice: '۵,۱۰۰,۰۰۰', price: '۴,۲۰۰,۰۰۰', discount: '۱۷٪ تخفیف' },
  { id: 10, brand: 'لگراند',        title: 'کابل شبکه CAT6 لگراند ۳۰۵ متر',     icon: 'bi-hdd-network',                  rating: 4, reviews: '۱۹',  oldPrice: '۲,۲۰۰,۰۰۰', price: '۱,۸۵۰,۰۰۰', discount: '۱۶٪ تخفیف' },
];
