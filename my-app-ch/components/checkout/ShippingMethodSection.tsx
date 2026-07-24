import { ShippingMethodOption, ShippingTimeOption } from "@/interfaces/checkout/types";

interface ShippingMethodSectionProps {
  methods: ShippingMethodOption[];
  times: ShippingTimeOption[];
  selectedMethod: string;
  selectedTime: string;
  onMethodChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

export default function ShippingMethodSection({
  methods,
  times,
  selectedMethod,
  selectedTime,
  onMethodChange,
  onTimeChange,
}: ShippingMethodSectionProps) {
  return (
    <div className="checkout-card">
      <div className="checkout-card__header">
        <span className="checkout-card__title">
          <i className="bi bi-truck" />
          ۲. روش ارسال و زمان ارسال
        </span>
      </div>
      <div className="field-row">
        <div className="field-group">
          <span className="field-group__label">روش ارسال</span>
          <label className="select-box">
            <i className="bi bi-truck select-box__icon" />
            <select value={selectedMethod} onChange={(e) => onMethodChange(e.target.value)}>
              {methods.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down select-box__chevron" />
          </label>
        </div>
        <div className="field-group">
          <span className="field-group__label">زمان ارسال</span>
          <label className="select-box">
            <i className="bi bi-clock select-box__icon" />
            <select value={selectedTime} onChange={(e) => onTimeChange(e.target.value)}>
              {times.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <i className="bi bi-chevron-down select-box__chevron" />
          </label>
        </div>
      </div>
    </div>
  );
}
