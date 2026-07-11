import Link from 'next/link';
import OrderRow from './OrderRow';
import { RECENT_ORDERS } from '@/utils/mockData/dashboardData';

export default function RecentOrders() {
  return (
    <section className="db-orders" aria-label="آخرین سفارش‌ها">
      <div className="db-orders__header">
        <h2 className="db-orders__title">آخرین سفارش ها</h2>
        <Link href="/dashboard/orders" className="db-orders__view-all">
          مشاهده همه
        </Link>
      </div>

      <ul className="db-orders__list" role="list">
        {RECENT_ORDERS.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
