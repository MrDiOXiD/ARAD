'use client';

import { addDays, format, isSameDay } from 'date-fns';
import { useMemo } from 'react';

interface DeliveryCalendarProps {
  selectedDate: string | null; // 'YYYY-MM-DD'
  onSelect: (date: string) => void;
}

const WEEKDAY_FA = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];

export default function DeliveryCalendar({ selectedDate, onSelect }: DeliveryCalendarProps) {
  // 14 selectable days, starting tomorrow — matches the backend's
  // assertDeliveryDateInWindow() exactly, so nothing selectable here
  // can ever be rejected server-side.
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => addDays(today, i + 1));
  }, []);

  return (
    <div className="checkout-card">
      <div className="checkout-card__header">
        <span className="checkout-card__title">
          <i className="bi bi-calendar3" />
          ۳. زمان تحویل
        </span>
      </div>

      <div className="delivery-cal">
        {days.map((day) => {
          const value = format(day, 'yyyy-MM-dd');
          const isSelected = selectedDate ? isSameDay(day, new Date(selectedDate + 'T00:00:00')) : false;

          return (
            <button
              type="button"
              key={value}
              className={`delivery-cal__day ${isSelected ? 'delivery-cal__day--selected' : ''}`}
              onClick={() => onSelect(value)}
            >
              <span className="delivery-cal__weekday">{WEEKDAY_FA[day.getDay()]}</span>
              <span className="delivery-cal__date">{day.toLocaleDateString('fa-IR', { day: 'numeric' })}</span>
              <span className="delivery-cal__month">{day.toLocaleDateString('fa-IR', { month: 'short' })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
