'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import '@/styles/components/login.css';

type Mode = 'login' | 'register';

export default function AuthPage({ defaultMode = 'login' }: { defaultMode?: Mode }) {
  const [mode, setMode]               = useState<Mode>(defaultMode);
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const decoRef = useRef<HTMLDivElement>(null);

  /* ── Login state ── */
  const [lPhone, setLPhone] = useState('');
  const [lPass,  setLPass]  = useState('');
  const [lPhErr, setLPhErr] = useState('');
  const [lPaErr, setLPaErr] = useState('');

  /* ── Register state ── */
  const [rName,    setRName]    = useState('');
  const [rPhone,   setRPhone]   = useState('');
  const [rPass,    setRPass]    = useState('');
  const [rConfirm, setRConfirm] = useState('');
  const [rTerms,   setRTerms]   = useState(false);
  const [rNameErr, setRNameErr] = useState('');
  const [rPhErr,   setRPhErr]   = useState('');
  const [rPaErr,   setRPaErr]   = useState('');
  const [rCoErr,   setRCoErr]   = useState('');

  const isReg = mode === 'register';

  /* ── Switch mode + trigger deco slide animation ── */
  const switchMode = (next: Mode) => {
    const deco = decoRef.current;
    if (deco) {
      // Remove any existing animation, force reflow, then re-add
      deco.removeAttribute('data-slide');
      void deco.offsetWidth; // reflow
      deco.setAttribute('data-slide', next === 'register' ? 'from-right' : 'from-left');
    }
    setMode(next);
  };

  /* ── Handlers ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!lPhone || lPhone.length < 10) { setLPhErr('شماره موبایل معتبر وارد کنید'); ok = false; } else setLPhErr('');
    if (!lPass  || lPass.length  < 6)  { setLPaErr('رمز عبور باید حداقل ۶ کاراکتر باشد'); ok = false; } else setLPaErr('');
    if (ok) console.log('login', { lPhone, lPass });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let ok = true;
    if (!rName)                        { setRNameErr('نام خود را وارد کنید'); ok = false; }             else setRNameErr('');
    if (!rPhone || rPhone.length < 10) { setRPhErr('شماره موبایل معتبر وارد کنید'); ok = false; }      else setRPhErr('');
    if (!rPass  || rPass.length  < 6)  { setRPaErr('رمز عبور باید حداقل ۶ کاراکتر باشد'); ok = false; } else setRPaErr('');
    if (rConfirm !== rPass)            { setRCoErr('رمز عبور و تکرار آن یکسان نیستند'); ok = false; }   else setRCoErr('');
    if (ok) console.log('register', { rName, rPhone, rPass });
  };

  return (
    <div className={`auth-page${isReg ? ' is-register' : ''}`}>

      {/* ════ DECORATIVE PANEL ════ */}
      <div className="auth-deco" ref={decoRef}>
        <div className="auth-deco-glow" />
        <i className="bi bi-lightbulb-fill auth-deco-icon" />
        <p className="auth-deco-title">الکتریکی آنلاین</p>
        <p className="auth-deco-sub">بزرگ‌ترین فروشگاه آنلاین<br />لوازم برقی ایران</p>
        <div className="auth-deco-bottom">
          <i className="bi bi-lightning-charge-fill" />
          onlineelectricy.com
        </div>
      </div>

      {/* ════ FORMS TRACK ════ */}
      <div className="auth-forms-track">

        {/* ── LOGIN PANE ── */}
        <div className="auth-pane auth-pane-login" dir="rtl">
          <Link href="/" className="lgn-back" dir="ltr">
            <i className="bi bi-arrow-right" /> بازگشت
          </Link>

          <div className="lgn-logo">
            <div className="lgn-logo-icon"><i className="bi bi-lightning-charge-fill" /></div>
            <div>
              <div className="lgn-logo-name">الکتریکی آنلاین</div>
              <div className="lgn-logo-url">onlineelectricy.com</div>
            </div>
          </div>

          <h1 className="lgn-heading">ورود به حساب کاربری</h1>
          <p className="lgn-sub">خوش برگشتید! اطلاعات خود را وارد کنید.</p>

          <form onSubmit={handleLogin} noValidate>
            <div className={`lgn-field${lPhErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="l-phone">شماره موبایل</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-phone lgn-input-icon" />
                <input id="l-phone" type="tel" inputMode="numeric" placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="lgn-input" value={lPhone} onChange={e => setLPhone(e.target.value)} />
              </div>
              {lPhErr && <span className="lgn-error">{lPhErr}</span>}
            </div>

            <div className={`lgn-field${lPaErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="l-pass">رمز عبور</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-lock lgn-input-icon" />
                <input id="l-pass" type={showPass ? 'text' : 'password'} placeholder="رمز عبور خود را وارد کنید"
                  className="lgn-input" value={lPass} onChange={e => setLPass(e.target.value)} />
                <button type="button" className="lgn-eye" onClick={() => setShowPass(p => !p)}>
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
              {lPaErr && <span className="lgn-error">{lPaErr}</span>}
            </div>

            <div className="lgn-row">
              <label className="lgn-remember">
                <input type="checkbox" /> مرا به خاطر بسپار
              </label>
              <Link href="/forgot-password" className="lgn-forgot">فراموشی رمز عبور؟</Link>
            </div>

            <button type="submit" className="lgn-btn">
              <i className="bi bi-box-arrow-in-right" /> ورود
            </button>
          </form>

          <div className="lgn-divider">یا</div>
          <p className="lgn-switch">
            حساب کاربری ندارید؟
            <button type="button" onClick={() => switchMode('register')}>ثبت نام کنید</button>
          </p>
        </div>

        {/* ── REGISTER PANE ── */}
        <div className="auth-pane auth-pane-register" dir="rtl">
          <Link href="/" className="lgn-back" dir="ltr">
            <i className="bi bi-arrow-right" /> بازگشت
          </Link>

          <div className="lgn-logo">
            <div className="lgn-logo-icon"><i className="bi bi-lightning-charge-fill" /></div>
            <div>
              <div className="lgn-logo-name">الکتریکی آنلاین</div>
              <div className="lgn-logo-url">onlineelectricy.com</div>
            </div>
          </div>

          <h1 className="lgn-heading">ایجاد حساب کاربری</h1>
          <p className="lgn-sub">اطلاعات خود را وارد کنید.</p>

          <form onSubmit={handleRegister} noValidate>
            <div className={`lgn-field${rNameErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="r-name">نام و نام خانوادگی</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-person lgn-input-icon" />
                <input id="r-name" type="text" placeholder="علی محمدی"
                  className="lgn-input" value={rName} onChange={e => setRName(e.target.value)} />
              </div>
              {rNameErr && <span className="lgn-error">{rNameErr}</span>}
            </div>

            <div className={`lgn-field${rPhErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="r-phone">شماره موبایل</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-phone lgn-input-icon" />
                <input id="r-phone" type="tel" inputMode="numeric" placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="lgn-input" value={rPhone} onChange={e => setRPhone(e.target.value)} />
              </div>
              {rPhErr && <span className="lgn-error">{rPhErr}</span>}
            </div>

            <div className="lgn-row-2">
              <div className={`lgn-field${rPaErr ? ' has-error' : ''}`}>
                <label className="lgn-label" htmlFor="r-pass">رمز عبور</label>
                <div className="lgn-input-wrap">
                  <i className="bi bi-lock lgn-input-icon" />
                  <input id="r-pass" type={showPass ? 'text' : 'password'} placeholder="حداقل ۶ کاراکتر"
                    className="lgn-input" value={rPass} onChange={e => setRPass(e.target.value)} />
                  <button type="button" className="lgn-eye" onClick={() => setShowPass(p => !p)}>
                    <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </button>
                </div>
                {rPaErr && <span className="lgn-error">{rPaErr}</span>}
              </div>

              <div className={`lgn-field${rCoErr ? ' has-error' : ''}`}>
                <label className="lgn-label" htmlFor="r-confirm">تکرار رمز عبور</label>
                <div className="lgn-input-wrap">
                  <i className="bi bi-lock-fill lgn-input-icon" />
                  <input id="r-confirm" type={showConfirm ? 'text' : 'password'} placeholder="تکرار رمز"
                    className="lgn-input" value={rConfirm} onChange={e => setRConfirm(e.target.value)} />
                  <button type="button" className="lgn-eye" onClick={() => setShowConfirm(p => !p)}>
                    <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </button>
                </div>
                {rCoErr && <span className="lgn-error">{rCoErr}</span>}
              </div>
            </div>

            <label className="lgn-terms">
              <input type="checkbox" checked={rTerms} onChange={e => setRTerms(e.target.checked)} />
              <span>با <Link href="/terms">قوانین و مقررات</Link> سایت موافقم</span>
            </label>

            <button type="submit" className="lgn-btn">
              <i className="bi bi-person-check-fill" /> ثبت نام
            </button>
          </form>

          <div className="lgn-divider">یا</div>
          <p className="lgn-switch">
            قبلاً ثبت نام کرده‌اید؟
            <button type="button" onClick={() => switchMode('login')}>وارد شوید</button>
          </p>
        </div>

      </div>{/* end auth-forms-track */}
    </div>
  );
}
