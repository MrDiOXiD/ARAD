'use client';

interface QuantityPickerProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
}

export default function QuantityPicker({
  value,
  onIncrement,
  onDecrement,
  min = 1,
}: QuantityPickerProps) {
  return (
    <div className="qty-picker" role="group" aria-label="تعداد">
      <button
        type="button"
        className="qty-picker__btn"
        onClick={onIncrement}
        aria-label="افزایش تعداد"
      >
        +
      </button>
      <span className="qty-picker__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="qty-picker__btn"
        onClick={onDecrement}
        disabled={value <= min}
        aria-label="کاهش تعداد"
      >
        −
      </button>
    </div>
  );
}
