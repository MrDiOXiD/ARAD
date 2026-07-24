import { PaymentMethod } from "@/interfaces/checkout/types";

interface PaymentMethodSectionProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodSection({ selected, onSelect }: PaymentMethodSectionProps) {
  return (
    <div className="checkout-card">
      <div className="checkout-card__header">
        <span className="checkout-card__title">
          <i className="bi bi-credit-card" />
          ۳. روش پرداخت
        </span>
      </div>
      <div className="pay-grid">
        <div
          className={`pay-option ${selected === 'cod' ? 'pay-option--selected' : ''}`}
          onClick={() => onSelect('cod')}
          role="radio"
          aria-checked={selected === 'cod'}
          tabIndex={0}
        >
          <span className="pay-option__radio">
            <span className="pay-option__radio-dot" />
          </span>
          <span className="pay-option__text">
            <span className="pay-option__title">پرداخت در محل</span>
            <span className="pay-option__sub">پرداخت هنگام تحویل کالا</span>
          </span>
        </div>
        <div
          className={`pay-option ${selected === 'online' ? 'pay-option--selected' : ''}`}
          onClick={() => onSelect('online')}
          role="radio"
          aria-checked={selected === 'online'}
          tabIndex={0}
        >
          <span className="pay-option__radio">
            <span className="pay-option__radio-dot" />
          </span>
          <span className="pay-option__text">
            <span className="pay-option__title">پرداخت اینترنتی</span>
            <span className="pay-option__sub">پرداخت از طریق درگاه بانکی</span>
          </span>
        </div>
      </div>
    </div>
  );
}
