'use client';

import { useState } from 'react';

interface PasswordField {
  key: 'current' | 'next' | 'confirm';
  label: string;
}

const FIELDS: PasswordField[] = [
  { key: 'current', label: 'رمز عبور فعلی'    },
  { key: 'next',    label: 'رمز عبور جدید'    },
  { key: 'confirm', label: 'تکرار رمز عبور جدید' },
];

export default function ChangePasswordForm() {
  const [values,  setValues]  = useState({ current: '', next: '', confirm: '' });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });

  const setVal = (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((p) => ({ ...p, [key]: e.target.value }));

  const toggleVis = (key: keyof typeof visible) =>
    setVisible((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="ac-card">
      <div className="ac-card__icon-wrap">
        <i className="bi bi-lock ac-card__icon" aria-hidden="true" />
      </div>
      <h2 className="ac-card__title">تغییر رمز عبور</h2>
      <p className="ac-card__subtitle">
        برای حفظ امنیت حساب کاربری، رمز عبور خود را به صورت دوره‌ای تغییر دهید.
      </p>

      <div className="ac-form">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="ac-form__field">
            <label className="ac-form__label">{label}</label>
            <div className="ac-form__pw-wrap">
              <input
                className="ac-form__input ac-form__input--pw"
                type={visible[key] ? 'text' : 'password'}
                value={values[key]}
                onChange={setVal(key)}
                dir="ltr"
              />
              <button
                type="button"
                className="ac-form__pw-toggle"
                onClick={() => toggleVis(key)}
                aria-label={visible[key] ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                <i className={`bi ${visible[key] ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        <p className="ac-form__hint">
          <i className="bi bi-check-circle-fill" style={{ color: '#22c55e' }} aria-hidden="true" />
          رمز عبور شما باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد.
        </p>

        <button type="button" className="ac-btn ac-btn--dark">ذخیره تغییرات</button>
      </div>
    </div>
  );
}
