'use client';

import { useDeliveryMethods } from '@/hooks/useDeliveryMethods';

interface DeliveryMethodSectionProps {
  selectedId: number | null;
  onSelect: (id: number, feeEstimate: number) => void;
  totalQuantity: number; // for showing an estimated fee client-side; real fee always recomputed server-side
}

export default function DeliveryMethodSection({ selectedId, onSelect, totalQuantity }: DeliveryMethodSectionProps) {
  const { methods, isLoading } = useDeliveryMethods();

  if (isLoading) return <div className="checkout-card" aria-busy="true" />;

  return (
    <div className="checkout-card">
      <div className="checkout-card__header">
        <span className="checkout-card__title">
          <i className="bi bi-truck" />
          ۲. روش ارسال
        </span>
      </div>

      <div className="pay-grid">
        {methods.map((method) => {
          const estimatedFee = Number(method.baseFee) + Number(method.perItemFee) * totalQuantity;
          return (
            <div
              key={method.id}
              className={`pay-option ${selectedId === method.id ? 'pay-option--selected' : ''}`}
              onClick={() => onSelect(method.id, estimatedFee)}
              role="radio"
              aria-checked={selectedId === method.id}
              tabIndex={0}
            >
              <span className="pay-option__radio"><span className="pay-option__radio-dot" /></span>
              <span className="pay-option__text">
                <span className="pay-option__title">
                  <i className={`bi ${method.type === 'pickup' ? 'bi-shop' : 'bi-truck'}`} style={{ marginLeft: 6 }} />
                  {method.label}
                </span>
                <span className="pay-option__sub">{estimatedFee.toLocaleString('fa-IR')} تومان</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
