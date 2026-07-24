'use client';

import { useMemo, useState } from 'react';
import DeliveryAddressSection from '@/components/checkout/DeliveryAddressSection';
import ShippingMethodSection from '@/components/checkout/ShippingMethodSection';
import PaymentMethodSection from '@/components/checkout/PaymentMethodSection';
import OrderSummary from '@/components/checkout/OrderSummary';
import TrustBadges from '@/components/checkout/TrustBadges';
import {
  CheckoutAddress,
  OrderItem,
  PaymentMethod,
  ShippingMethodOption,
  ShippingTimeOption,
  StepperStep,
} from '@/interfaces/checkout/types';
import '@/styles/components/checkout.css';
import '@/styles/components/cart.css'
import CheckoutStepper from '@/components/checkout/CheckoutStepper';


const STEPS: StepperStep[] = [
  { key: 'cart', label: 'سبد خرید', icon: 'bi-cart3', status: 'done' },
  { key: 'shipping-info', label: 'اطلاعات ارسال', icon: 'bi-truck', status: 'active' },
  { key: 'payment', label: 'پرداخت', icon: 'bi-credit-card-2-front', status: 'upcoming' },
  { key: 'complete', label: 'تکمیل سفارش', icon: 'bi-check2', status: 'upcoming' },
];

const ADDRESSES: CheckoutAddress[] = [
  {
    id: 'home',
    tag: 'منزل',
    name: 'حسام محمدی',
    phone: '۰۹۱۳ ۱۲۳ ۴۵۶۷',
    addressLine: 'تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۰، واحد ۳',
    postalCode: '۱۹۶۷۸۳۴۵۱۱',
  },
  {
    id: 'work',
    tag: 'محل کار',
    name: 'حسام محمدی',
    phone: '۰۹۱۳ ۱۲۳ ۴۵۶۷',
    addressLine: 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۰، واحد ۲',
    postalCode: '۱۹۶۷۸۳۴۵۱۱',
  },
];

const SHIPPING_METHODS: ShippingMethodOption[] = [
  { value: 'snapp', label: 'ارسال با اسنپ پیک', icon: 'bi-truck' },
  { value: 'post', label: 'ارسال با پست پیشتاز', icon: 'bi-truck' },
];

const SHIPPING_TIMES: ShippingTimeOption[] = [
  { value: 'sun-12-16', label: 'یکشنبه بیست و یکم، ۱۲ تا ۱۶' },
  { value: 'mon-9-13', label: 'دوشنبه بیست و دوم، ۹ تا ۱۳' },
];

const ORDER_ITEMS: OrderItem[] = [
  { id: '1', title: 'لامپ LED اشکال مدل E27، ۱۲ وات نور گرم', qty: 2, price: 740000 },
  { id: '2', title: 'خودکار شیابومی مدل MZXB-01WC', qty: 1, price: 920000 },
  { id: '3', title: 'سیم و کابل برق مسی ۳×۱.۵ میلی‌متر', qty: 1, price: 1280000 },
];

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState('work');
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0].value);
  const [shippingTime, setShippingTime] = useState(SHIPPING_TIMES[0].value);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [discount, setDiscount] = useState(150000);

  const totals = useMemo(() => {
    const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingFee = 65000;
    return {
      subtotal,
      shippingFee,
      discount,
      total: subtotal + shippingFee - discount,
    };
  }, [discount]);

  return (
    <div className="checkout-page" dir="rtl">
      <div className="checkout-page__container">
        <CheckoutStepper steps={STEPS} />

        <div className="checkout-page__layout">
          <div className="checkout-main">
            <DeliveryAddressSection
              addresses={ADDRESSES}
              selectedId={selectedAddress}
              onSelect={setSelectedAddress}
              onEdit={(id) => console.log('edit address', id)}
              onAddNew={() => console.log('add new address')}
            />

            <ShippingMethodSection
              methods={SHIPPING_METHODS}
              times={SHIPPING_TIMES}
              selectedMethod={shippingMethod}
              selectedTime={shippingTime}
              onMethodChange={setShippingMethod}
              onTimeChange={setShippingTime}
            />

            <PaymentMethodSection selected={paymentMethod} onSelect={setPaymentMethod} />
          </div>

          <OrderSummary
            items={ORDER_ITEMS}
            totals={totals}
            onApplyPromo={(code) => console.log('apply promo', code)}
            onConfirm={() => console.log('confirm checkout', {
              selectedAddress,
              shippingMethod,
              shippingTime,
              paymentMethod,
            })}
          />
        </div>

        <TrustBadges />
      </div>
    </div>
  );
}
