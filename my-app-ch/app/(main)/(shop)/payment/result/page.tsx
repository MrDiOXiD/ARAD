'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/components/payment-result.css';
import * as paymentApi from '@/lib/payment/payment.api';
import { ApiError } from '@/lib/auth/authFetch';

function formatPrice(n: number): string {
  return n.toLocaleString('fa-IR');
}

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trackId = searchParams.get('trackId');

  const [result, setResult] = useState<paymentApi.VerifyPaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionPending, setActionPending] = useState<'retry' | 'cod' | null>(null);

  useEffect(() => {
    if (!trackId) {
      setError('اطلاعات پرداخت یافت نشد.');
      setIsLoading(false);
      return;
    }
    paymentApi
      .verifyPayment(trackId)
      .then(setResult)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'خطا در بررسی وضعیت پرداخت'))
      .finally(() => setIsLoading(false));
  }, [trackId]);

  async function handleRetryZibal() {
    if (!result) return;
    setActionPending('retry');
    try {
      const { payUrl } = await paymentApi.retryPayment(result.order.id);
      window.location.href = payUrl;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تلاش مجدد ناموفق بود');
      setActionPending(null);
    }
  }

  async function handleSwitchToCod() {
    if (!result) return;
    setActionPending('cod');
    try {
      await paymentApi.switchToCod(result.order.id);
      router.push(`/order-confirmed/${result.order.id}?method=cod`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'تغییر روش پرداخت ناموفق بود');
      setActionPending(null);
    }
  }

  if (isLoading) {
    return <div className="pr-page" aria-busy="true" dir="rtl" />;
  }

  if (error || !result) {
    return (
      <div className="pr-page" dir="rtl">
        <div className="pr-card">
          <div className="pr-hero">
            <div className="pr-hero__icon-wrap pr-hero__icon-wrap--failure">
              <i className="bi bi-x-lg" />
            </div>
            <h1 className="pr-hero__title">خطا در بررسی پرداخت</h1>
            <p className="pr-hero__subtitle">{error || 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.'}</p>
            <Link href="/cart" className="pr-btn pr-btn--outline">
              بازگشت به سبد خرید
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { order } = result;
  const isSuccess = result.success;

  return (
    <div className="pr-page" dir="rtl">
      <div className="pr-card">
        <div className="pr-hero">
          <div className={`pr-hero__icon-wrap ${isSuccess ? 'pr-hero__icon-wrap--success' : 'pr-hero__icon-wrap--failure'}`}>
            <i className={`bi ${isSuccess ? 'bi-check-lg' : 'bi-x-lg'}`} />
          </div>

          <h1 className="pr-hero__title">
            {isSuccess ? 'پرداخت با موفقیت انجام شد!' : 'پرداخت ناموفق بود!'}
          </h1>
          <p className="pr-hero__subtitle">
            {isSuccess
              ? 'سفارش شما با موفقیت ثبت و پرداخت شد.'
              : 'متأسفانه پرداخت شما با موفقیت انجام نشد. لطفاً دوباره تلاش کنید یا روش پرداخت دیگری انتخاب نمایید.'}
          </p>

          <div className="pr-hero__order-box">
            <span className="pr-hero__order-label">شماره سفارش</span>
            <span className="pr-hero__order-number">{order.id}</span>
            <span className="pr-hero__timestamp">
              <i className="bi bi-clock" />
              زمان ثبت سفارش: {new Date(order.orderAt).toLocaleString('fa-IR')}
            </span>
          </div>

          <div className="pr-hero__actions">
            {isSuccess ? (
              <>
                <Link href={`/dashboard/orders/${order.id}`} className="pr-btn pr-btn--outline">
                  <i className="bi bi-eye" />
                  مشاهده جزئیات سفارش
                </Link>
              </>
            ) : (
              <>
                <button type="button" className="pr-btn pr-btn--primary" onClick={handleRetryZibal} disabled={!!actionPending}>
                  <i className="bi bi-arrow-repeat" />
                  {actionPending === 'retry' ? 'در حال انتقال...' : 'تلاش مجدد'}
                </button>
                <Link href="/cart" className="pr-btn pr-btn--outline">
                  <i className="bi bi-arrow-right" />
                  بازگشت به سبد خرید
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="pr-body">
          <div>
            <h2 className="pr-section-title">خلاصه سفارش</h2>
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

          {isSuccess ? (
            <div>
              <h2 className="pr-section-title">مراحل بعدی</h2>
              <div className="pr-steps">
                <div className="pr-step pr-step--done">
                  <span className="pr-step__icon"><i className="bi bi-check2" /></span>
                  <span className="pr-step__line" />
                  <span className="pr-step__label">ثبت سفارش</span>
                </div>
                <div className="pr-step pr-step--done">
                  <span className="pr-step__icon"><i className="bi bi-credit-card" /></span>
                  <span className="pr-step__line" />
                  <span className="pr-step__label">پرداخت</span>
                </div>
                <div className="pr-step pr-step--pending">
                  <span className="pr-step__icon"><i className="bi bi-box-seam" /></span>
                  <span className="pr-step__line" />
                  <span className="pr-step__label">در حال آماده‌سازی</span>
                </div>
              </div>

              <div className="pr-support-card">
                <span className="pr-support-card__icon"><i className="bi bi-headset" /></span>
                <div>
                  <div className="pr-action-card__title">سوالی دارید؟</div>
                  <div className="pr-support-card__phone">021-77268004</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="pr-section-title">چه کاری می‌تونم انجام بدم؟</h2>
              <div className="pr-actions-grid">
                <button type="button" className="pr-action-card" onClick={handleRetryZibal} disabled={!!actionPending}>
                  <span className="pr-action-card__icon"><i className="bi bi-arrow-repeat" /></span>
                  <span className="pr-action-card__text">
                    <span className="pr-action-card__title">تلاش مجدد برای پرداخت</span>
                    <span className="pr-action-card__sub">اطلاعات بانکی خود را بررسی و دوباره پرداخت را انجام دهید.</span>
                  </span>
                </button>

                <button type="button" className="pr-action-card" onClick={handleSwitchToCod} disabled={!!actionPending}>
                  <span className="pr-action-card__icon"><i className="bi bi-cash-coin" /></span>
                  <span className="pr-action-card__text">
                    <span className="pr-action-card__title">پرداخت در محل</span>
                    <span className="pr-action-card__sub">
                      {actionPending === 'cod' ? 'در حال ثبت...' : 'سفارش را با پرداخت هنگام تحویل نهایی کنید.'}
                    </span>
                  </span>
                </button>

                <div className="pr-action-card" style={{ cursor: 'default' }}>
                  <span className="pr-action-card__icon"><i className="bi bi-headset" /></span>
                  <span className="pr-action-card__text">
                    <span className="pr-action-card__title">سوال دارید؟</span>
                    <span className="pr-action-card__sub" style={{ direction: 'ltr', textAlign: 'right' }}>021-77268004</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
