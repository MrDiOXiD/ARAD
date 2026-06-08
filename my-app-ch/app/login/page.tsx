'use client';

import { useState } from 'react';
import Link from 'next/link';
import '@/styles/components/login.css';

export default function LoginPage() {
  const [showPass, setShowPass]     = useState(false);
  const [phone, setPhone]           = useState('');
  const [password, setPassword]     = useState('');
  const [phoneErr, setPhoneErr]     = useState('');
  const [passErr, setPassErr]       = useState('');

  const validate = () => {
    let ok = true;
    if (!phone || phone.length < 10) {
      setPhoneErr('شماره موبایل معتبر وارد کنید');
      ok = false;
    } else {
      setPhoneErr('');
    }
    if (!password || password.length < 6) {
      setPassErr('رمز عبور باید حداقل ۶ کاراکتر باشد');
      ok = false;
    } else {
      setPassErr('');
    }
    return ok;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: call your auth API here
    console.log('login', { phone, password });
  };

  return (
    <div className="lgn-page">

      {/* ════ LEFT DECORATIVE PANEL ════ */}
      <div className="lgn-deco">
        <div className="lgn-deco-glow" />
        <i className="bi bi-lightbulb-fill lgn-deco-icon" />
        <p className="lgn-deco-title">الکتریکی آنلاین</p>
        <p className="lgn-deco-sub">
          بزرگ‌ترین فروشگاه آنلاین<br />
          لوازم برقی و الکتریکی ایران
        </p>
        <div className="lgn-deco-bottom">
          <i className="bi bi-lightning-charge-fill" />
          onlineelectricy.com
        </div>
      </div>

      {/* ════ FORM PANEL ════ */}
      <div className="lgn-panel" dir="rtl">

        {/* Back to home */}
        <Link href="/" className="lgn-back" dir="ltr">
          <i className="bi bi-arrow-right" />
          بازگشت
        </Link>

        {/* Logo */}
        <div className="lgn-logo">
          <div className="lgn-logo-icon">
            <i className="bi bi-lightning-charge-fill" />
          </div>
          <div>
            <div className="lgn-logo-name">الکتریکی آنلاین</div>
            <div className="lgn-logo-url">onlineelectricy.com</div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="lgn-heading">ورود به حساب کاربری</h1>
        <p className="lgn-sub">خوش برگشتید! اطلاعات خود را وارد کنید.</p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Phone */}
          <div className={`lgn-field${phoneErr ? ' has-error' : ''}`}>
            <label className="lgn-label" htmlFor="phone">شماره موبایل</label>
            <div className="lgn-input-wrap">
              <i className="bi bi-phone lgn-input-icon" />
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="lgn-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            {phoneErr && <span className="lgn-error" style={{ display: 'block' }}>{phoneErr}</span>}
          </div>

          {/* Password */}
          <div className={`lgn-field${passErr ? ' has-error' : ''}`}>
            <label className="lgn-label" htmlFor="password">رمز عبور</label>
            <div className="lgn-input-wrap">
              <i className="bi bi-lock lgn-input-icon" />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="رمز عبور خود را وارد کنید"
                className="lgn-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="lgn-eye"
                onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
            {passErr && <span className="lgn-error" style={{ display: 'block' }}>{passErr}</span>}
          </div>

          {/* Remember + Forgot */}
          <div className="lgn-row">
            <label className="lgn-remember">
              <input type="checkbox" />
              مرا به خاطر بسپار
            </label>
            <Link href="/forgot-password" className="lgn-forgot">
              فراموشی رمز عبور؟
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" className="lgn-btn">
            <i className="bi bi-box-arrow-in-right" />
            ورود
          </button>

        </form>

        {/* Divider */}
        <div className="lgn-divider">یا</div>

        {/* Register */}
        <p className="lgn-register">
          حساب کاربری ندارید؟
          <Link href="/register">ثبت نام کنید</Link>
        </p>

      </div>
    </div>
  );
}
