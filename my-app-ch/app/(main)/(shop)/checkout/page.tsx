'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import DeliveryAddressSection from '@/components/checkout/DeliveryAddressSection';
import DeliveryMethodSection from '@/components/checkout/DeliveryMethodSection';
import DeliveryCalendar from '@/components/checkout/DeliveryCalendar';
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection';
import OrderSummary from '@/components/checkout/OrderSummary';
import TrustBadges from '@/components/checkout/TrustBadges';
import { useAddresses } from '@/hooks/useAddresses';
import { useAppSelector, useAppDispatch } from '@/store-redux/hooks';
import { clearCart } from '@/store-redux/features/cart/cartSlice';
import { createOrder, initiatePayment } from '@/lib/order/orders.api';
import { ApiError } from '@/lib/auth/authFetch';
import '@/styles/components/checkout.css';
import '@/styles/components/cart.css';
import '@/styles/components/delivery-calendar.css';

const STEPS = [
  { key: 'cart', label: 'سبد خرید', icon: 'bi-cart3', status: 'done' as const },
  { key: 'shipping-info', label: 'اطلاعات ارسال', icon: 'bi-truck', status: 'active' as const },
  { key: 'payment', label: 'پرداخت', icon: 'bi-credit-card-2-front', status: 'upcoming' as const },
  { key: 'complete', label: 'تکمیل سفارش', icon: 'bi-check2', status: 'upcoming' as const },
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Real cart, not a placeholder. NOTE: assumes CartItem has
  // `unitPrice` (matching your earliest observed cart shape) — if the
  // real field name in interfaces/cart/types differs, tell me and
  // this is a one-line fix.
  const cartItems = useAppSelector((state) => state.cart.items);

  const { addresses, isLoading: addressesLoading } = useAddresses();
  const selectedAddress = addresses[0] ?? null; // default, or most recent — see earlier note

  const [deliveryMethodId, setDeliveryMethodId] = useState<number | null>(null);
  const [deliveryFeeEstimate, setDeliveryFeeEstimate] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuantity = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  // Client-side subtotal is DISPLAY ONLY — the authoritative price is
  // always recalculated server-side in calculateTotalPrice(), which
  // is what actually gets charged. A tampered client value here can
  // only make the UI look wrong, never affect what's billed.
  const subtotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const totals = useMemo(
    () => ({
      subtotal,
      shippingFee: deliveryFeeEstimate,
      discount: 0,
      total: subtotal + deliveryFeeEstimate,
    }),
    [subtotal, deliveryFeeEstimate],
  );

  const canSubmit =
    Boolean(selectedAddress) && Boolean(deliveryMethodId) && Boolean(deliveryDate) && cartItems.length > 0;

  async function handleSubmit() {
    if (!canSubmit || !selectedAddress || !deliveryMethodId || !deliveryDate) return;
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const { order } = await createOrder({
        addressId: selectedAddress.id,
        orderProducts: cartItems.map((i) => ({ productId: i.id, order_quantity: i.quantity })),
        deliveryMethodId,
        requestedDeliveryDate: deliveryDate,
        paymentMethod,
      });

      // Order is confirmed server-side at this point regardless of
      // payment path — safe to clear the cart now.
      dispatch(clearCart());

      if (paymentMethod === 'cod') {
        router.push(`/order-confirmed/${order.id}?method=cod`);
        return;
      }

      const { payUrl } = await initiatePayment(order.id);
      window.location.href = payUrl;
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'خطایی رخ داد. لطفاً دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="checkout-page" dir="rtl">
      <div className="checkout-page__container">
        <CheckoutStepper steps={STEPS} />

        <div className="checkout-page__layout">
          <div className="checkout-main">
            {addressesLoading ? (
              <div className="checkout-card" aria-busy="true" />
            ) : (
              <DeliveryAddressSection
                addresses={addresses}
                selectedId={selectedAddress?.id ?? ''}
                onSelect={() => {}}
                onEdit={() => router.push('/dashboard/addresses')}
                onAddNew={() => router.push('/dashboard/addresses')}
              />
            )}

            <DeliveryMethodSection
              selectedId={deliveryMethodId}
              onSelect={(id, fee) => {
                setDeliveryMethodId(id);
                setDeliveryFeeEstimate(fee);
              }}
              totalQuantity={totalQuantity}
            />

            <DeliveryCalendar selectedDate={deliveryDate} onSelect={setDeliveryDate} />

            <PaymentMethodSection selected={paymentMethod} onSelect={setPaymentMethod} />
          </div>

          <OrderSummary
            items={cartItems.map((i) => ({ id: String(i.id), title: i.title, qty: i.quantity, price: i.unitPrice }))}
            totals={totals}
            onApplyPromo={() => {}}
            onConfirm={handleSubmit}
          />
        </div>

        {submitError && <p className="addr-modal__form-error" role="alert">{submitError}</p>}
        {isSubmitting && <p aria-busy="true">در حال ثبت سفارش...</p>}

        <TrustBadges />
      </div>
    </div>
  );
}
