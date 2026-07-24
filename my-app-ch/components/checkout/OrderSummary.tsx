import { OrderItem, OrderTotals } from '@/interfaces/checkout/types';
import { useState } from 'react';

interface OrderSummaryProps {
  items: OrderItem[];
  totals: OrderTotals;
  onApplyPromo: (code: string) => void;
  onConfirm: () => void;
}

function formatToman(value: number) {
  return `${value.toLocaleString('fa-IR')} تومان`;
}

export default function OrderSummary({ items, totals, onApplyPromo, onConfirm }: OrderSummaryProps) {
  const [promo, setPromo] = useState('');
  const [agreed, setAgreed] = useState(true);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <aside className="order-summary">
      <div className="order-summary__card">
        <div className="order-summary__title">
          <i className="bi bi-clipboard-check" style={{ marginLeft: 6, color: '#F5C518' }} />
          خلاصه سفارش ({itemCount} کالا)
        </div>

        <div className="order-summary__items">
          {items.map((item) => (
            <div key={item.id} className="order-summary__item">
              <span className="order-summary__item-img">
                <i className="bi bi-image" />
              </span>
              <div className="order-summary__item-info">
                <div className="order-summary__item-title">{item.title}</div>
                <div className="order-summary__item-qty">تعداد: {item.qty}</div>
              </div>
              <span className="order-summary__item-price">{formatToman(item.price)}</span>
            </div>
          ))}
        </div>

        <hr className="order-summary__divider" />

        <div className="order-summary__receipt">
          <div className="order-summary__row">
            <span className="order-summary__row-label">جمع کالاها</span>
            <span className="order-summary__row-value">{formatToman(totals.subtotal)}</span>
          </div>
          <div className="order-summary__row">
            <span className="order-summary__row-label">هزینه ارسال</span>
            <span className="order-summary__row-value">{formatToman(totals.shippingFee)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="order-summary__row">
              <span className="order-summary__row-label">تخفیف</span>
              <span className="order-summary__row-value order-summary__row-value--free">
                -{formatToman(totals.discount)}
              </span>
            </div>
          )}
        </div>

        <div className="promo-input">
          <input
            className="promo-input__field"
            placeholder="کد تخفیف را وارد کنید"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <button
            type="button"
            className="promo-input__apply-btn"
            disabled={!promo}
            onClick={() => onApplyPromo(promo)}
          >
            اعمال
          </button>
        </div>

        <hr className="order-summary__divider" />

        <div className="order-summary__total-row">
          <span className="order-summary__total-label">مبلغ قابل پرداخت</span>
          <span className="order-summary__total-value">{formatToman(totals.total)}</span>
        </div>

        <button type="button" className="order-summary__checkout-btn" onClick={onConfirm}>
          <i className="bi bi-lock" style={{ marginLeft: 8 }} />
          پرداخت و انتقال به درگاه
        </button>

        <label className="checkout-consent">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          با ثبت سفارش، قوانین و شرایط فروشگاه را می‌پذیرم.
        </label>
      </div>
    </aside>
  );
}
