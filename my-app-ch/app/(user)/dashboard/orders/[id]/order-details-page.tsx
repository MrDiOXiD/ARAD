'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import * as paymentApi from '@/lib/payment/payment.api';
import { ApiError } from '@/lib/auth/authFetch';
import '@/styles/components/payment-result.css';

function formatPrice(n: number): string {
  return n.toLocaleString('fa-IR');
}

const STATUS_LABEL_FA: Record<string, string> = {
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<paymentApi.OrderSummary | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    paymentApi
      .getMyOrder(orderId)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'سفارش یافت نشد'))
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) return <div className="pr-page" aria-busy="true" dir="rtl" />;

  if (error || !order) {
    return (
      <div className="pr-page" dir="rtl">
        <div className="pr-card">
          <div className="pr-hero">
            <h1 className="pr-hero__title">{error || 'سفارش یافت نشد'}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-page" dir="rtl">
      <div className="pr-card">
        <div className="pr-hero">
          <div className="pr-hero__order-box">
            <span className="pr-hero__order-label">شماره سفارش</span>
            <span className="pr-hero__order-number">{order.id}</span>
            <span className="pr-hero__timestamp">
              <i className="bi bi-clock" />
              {new Date(order.orderAt).toLocaleString('fa-IR')}
            </span>
          </div>
          <p className="pr-hero__subtitle" style={{ margin: 0 }}>
            وضعیت سفارش: <strong>{STATUS_LABEL_FA[order.status] ?? order.status}</strong>
            {' · '}
            روش پرداخت: {order.paymentMethod === 'cod' ? 'پرداخت در محل' : 'پرداخت اینترنتی'}
            {order.paidAt && ` · پرداخت شده در ${new Date(order.paidAt).toLocaleString('fa-IR')}`}
          </p>
        </div>

        <div className="pr-body" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <h2 className="pr-section-title">اقلام سفارش</h2>
            {order.products.map((p, idx) => (
              <div key={idx} className="pr-summary__row">
                <div>
                  <div className="pr-summary__item-title">{p.title}</div>
                  <div className="pr-summary__item-qty">تعداد: {p.quantity}</div>
                </div>
                <span className="pr-summary__item-price">{formatPrice(p.price * p.quantity)} تومان</span>
              </div>
            ))}

            <div className="pr-summary__totals">
              <div className="pr-summary__total-row">
                <span>جمع کالاها</span>
                <span>{formatPrice(order.subtotal)} تومان</span>
              </div>
              <div className="pr-summary__total-row">
                <span>هزینه ارسال</span>
                <span>{formatPrice(order.deliveryFee)} تومان</span>
              </div>
              <div className="pr-summary__grand-total">
                <span>مبلغ نهایی</span>
                <span>{formatPrice(order.total)} تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
