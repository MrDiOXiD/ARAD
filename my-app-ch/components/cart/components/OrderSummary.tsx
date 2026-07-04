import Link from 'next/link';
import PromoCodeInput from './PromoCodeInput';
import TrustBadges from './TrustBadges';

function formatPrice(n: number): string {
  return n.toLocaleString('fa-IR');
}

interface OrderSummaryProps {
  subtotal: number;
  shippingFree: boolean;
}

export default function OrderSummary({ subtotal, shippingFree }: OrderSummaryProps) {
  const total = shippingFree ? subtotal : subtotal + 50_000;

  return (
    <aside className="order-summary" aria-label="خلاصه سفارش">
      <div className="order-summary__card">
        <h3 className="order-summary__title">خلاصه سفارش</h3>

        <PromoCodeInput />

        {/* Receipt rows */}
        <dl className="order-summary__receipt">
          <div className="order-summary__row">
            <dt className="order-summary__row-label">جمع کالاها</dt>
            <dd className="order-summary__row-value">{formatPrice(subtotal)} تومان</dd>
          </div>
          <div className="order-summary__row">
            <dt className="order-summary__row-label">هزینه ارسال</dt>
            <dd className={`order-summary__row-value ${shippingFree ? 'order-summary__row-value--free' : ''}`}>
              {shippingFree ? 'رایگان' : `${formatPrice(50_000)} تومان`}
            </dd>
          </div>
        </dl>

        <hr className="order-summary__divider" />

        {/* Grand total */}
        <div className="order-summary__total-row">
          <span className="order-summary__total-label">مبلغ قابل پرداخت</span>
          <span className="order-summary__total-value">
            {formatPrice(total)} <small>تومان</small>
          </span>
        </div>

        {/* CTA buttons */}
        <Link href="/checkout" className="order-summary__checkout-btn">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" style={{ marginLeft: 8 }}>
            <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          ادامه و پرداخت سفارش
        </Link>

        <Link href="/shop" className="order-summary__continue-btn">
          ادامه خرید
        </Link>

        <TrustBadges />
      </div>
    </aside>
  );
}
