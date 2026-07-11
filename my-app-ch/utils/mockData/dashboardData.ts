import type { NavItem, Order, User } from '../../interfaces/dashboard/types';

export const CURRENT_USER: User = {
  name: 'علی',
  memberSince: '۲۰ فروردین ۱۴۰۳',
  avatarInitial: 'م',
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',  label: 'پیشخوان',              icon: 'bi-house-fill',    href: '/dashboard' },
  { id: 'wishlist',   label: 'علاقه‌مندی ها',         icon: 'bi-heart',         href: '/dashboard/wishlist' },
  { id: 'addresses',  label: 'آدرس ها',               icon: 'bi-geo-alt',       href: '/dashboard/addresses' },
  { id: 'account',    label: 'اطلاعات حساب کاربری',   icon: 'bi-person',        href: '/dashboard/account' },
  { id: 'logout',     label: 'خروج از حساب',          icon: 'bi-box-arrow-left', href: '/logout' },
];

export const RECENT_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#۱۳۴۵۶۷۸',
    icon: '✏️',
    amount: '۳,۴۴۸,۹۰۰',
    date: '۱۴۰۳/۰۶/۱۸',
    status: 'completed',
  },
  {
    id: '2',
    orderNumber: '#۱۳۴۵۶۷۷',
    icon: '💡',
    amount: '۱,۲۹۹,۰۰۰',
    date: '۱۴۰۳/۰۶/۱۶',
    status: 'processing',
  },
  {
    id: '3',
    orderNumber: '#۱۳۴۵۶۷۶',
    icon: '🔌',
    amount: '۲,۵۶۰,۰۰۰',
    date: '۱۴۰۳/۰۶/۱۵',
    status: 'pending',
  },
  {
    id: '4',
    orderNumber: '#۱۳۴۵۶۷۵',
    icon: '💿',
    amount: '۹۸۹,۰۰۰',
    date: '۱۴۰۳/۰۶/۱۳',
    status: 'cancelled',
  },
];

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  completed:  { label: 'تکمیل شده',       className: 'db-status--completed'  },
  processing: { label: 'در حال پردازش',   className: 'db-status--processing' },
  pending:    { label: 'در انتظار پرداخت', className: 'db-status--pending'    },
  cancelled:  { label: 'لغو شده',          className: 'db-status--cancelled'  },
};
