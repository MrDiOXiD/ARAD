import Link from 'next/link';
import OrderStatusBadge from './OrderStatusBadge';
import { Order } from '@/interfaces/dashboard/types';

interface OrderRowProps {
  order: Order;
}

export default function OrderRow({ order }: OrderRowProps) {
  return (
    <li className="db-order-row">
      {/* Product icon */}
      <div className="db-order-row__icon" aria-hidden="true">
        {order.icon}
      </div>

      {/* Order number */}
      <span className="db-order-row__number" dir="ltr">
        {order.orderNumber}
      </span>

      {/* Amount */}
      <span className="db-order-row__amount" dir="ltr">
        {order.amount}
        <small> تومان</small>
      </span>

      {/* Date */}
      <span className="db-order-row__date" dir="ltr">
        {order.date}
      </span>

      {/* Status */}
      <OrderStatusBadge status={order.status} />

      {/* Detail link */}
      <Link
        href={`/dashboard/orders/${order.id}`}
        className="db-order-row__detail"
        aria-label={`جزئیات سفارش ${order.orderNumber}`}
      >
        <i className="bi bi-chevron-left" />
      </Link>
    </li>
  );
}
