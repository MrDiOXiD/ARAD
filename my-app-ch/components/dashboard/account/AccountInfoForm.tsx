'use client';

import { useState } from 'react';

export default function AccountInfoForm() {
  const [form, setForm] = useState({
    firstName: 'محمد',
    lastName: 'رضایی',
    email: 'mohammad.rezaei@gmail.com',
    phone: '۰۹۱۲ ۱۲۳ ۴۵۶۷',
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="ac-card">
      <div className="ac-card__icon-wrap">
        <i className="bi bi-person ac-card__icon" aria-hidden="true" />
      </div>
      <h2 className="ac-card__title">اطلاعات حساب کاربری</h2>
      <p className="ac-card__subtitle">اطلاعات خود را مشاهده در صورت نیاز ویرایش کنید.</p>

      <div className="ac-form">
        <div className="ac-form__row">
          <div className="ac-form__field">
            <label className="ac-form__label">نام</label>
            <input className="ac-form__input" value={form.firstName} onChange={set('firstName')} />
          </div>
          <div className="ac-form__field">
            <label className="ac-form__label">نام خانوادگی</label>
            <input className="ac-form__input" value={form.lastName} onChange={set('lastName')} />
          </div>
        </div>

        <div className="ac-form__field">
          <label className="ac-form__label">ایمیل</label>
          <input className="ac-form__input" type="email" dir="ltr" value={form.email} onChange={set('email')} />
        </div>

        <div className="ac-form__field">
          <label className="ac-form__label">تلفن همراه</label>
          <input className="ac-form__input" type="tel" dir="ltr" value={form.phone} onChange={set('phone')} />
        </div>

        <button type="button" className="ac-btn ac-btn--dark">ذخیره تغییرات</button>
      </div>
    </div>
  );
}
