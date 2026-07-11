import { OrderStatus } from "@/interfaces/dashboard/types";
import { ORDER_STATUS_MAP } from "@/utils/mockData/dashboardData";


interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { label, className } = ORDER_STATUS_MAP[status];

  return (
    <span className={`db-status ${className}`} aria-label={`وضعیت: ${label}`}>
      {label}
    </span>
  );
}
