'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/components/login.css';
import { useAuth, ApiError } from '@/context/AuthContext';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

type Mode = 'login' | 'register';

export default function AuthPage({ defaultMode = 'login' }: { defaultMode?: Mode }) {
  const router = useRouter();
  const { login, registerAndLogin, loginWithGoogle, isLoginPending, isRegisterPending } = useAuth();

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const decoRef = useRef<HTMLDivElement>(null);

  /* ── Login state ── */
  const [lPhone, setLPhone] = useState('');
  const [lPass, setLPass] = useState('');
  const [lPhErr, setLPhErr] = useState('');
  const [lPaErr, setLPaErr] = useState('');
  const [lFormErr, setLFormErr] = useState(''); // server-side error (wrong password, etc.)

  /* ── Register state ── */
  const [rName, setRName] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rUsername, setRUsername] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rPass, setRPass] = useState('');
  const [rConfirm, setRConfirm] = useState('');
  const [rTerms, setRTerms] = useState(false);
  const [rNameErr, setRNameErr] = useState('');
  const [rEmailErr, setREmailErr] = useState('');
  const [rUsernameErr, setRUsernameErr] = useState('');
  const [rPhErr, setRPhErr] = useState('');
  const [rPaErr, setRPaErr] = useState('');
  const [rCoErr, setRCoErr] = useState('');
  const [rTermsErr, setRTermsErr] = useState('');
  const [rFormErr, setRFormErr] = useState('');

  const isReg = mode === 'register';

  const [googleErr, setGoogleErr] = useState('');


const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
  setGoogleErr('');
  if (!credentialResponse.credential) {
    setGoogleErr('ورود با گوگل ناموفق بود. دوباره تلاش کنید');
    return;
  }
  try {
    await loginWithGoogle(credentialResponse.credential);
    router.push('/');
  } catch {
    setGoogleErr('ورود با گوگل ناموفق بود. دوباره تلاش کنید');
  }
};

  /* ── Switch mode + trigger deco slide animation ── */
  const switchMode = (next: Mode) => {
    const deco = decoRef.current;
    if (deco) {
      deco.removeAttribute('data-slide');
      void deco.offsetWidth; // reflow
      deco.setAttribute('data-slide', next === 'register' ? 'from-right' : 'from-left');
    }
    setLFormErr('');
    setRFormErr('');
    setMode(next);
  };

  /**
   * Maps a caught error to a user-facing Persian message without
   * leaking backend internals. 401 → wrong credentials, 409 → already
   * registered, 400 → validation (shown with backend's own message
   * since those are meant to be user-facing), everything else → a
   * generic "try again" message so raw network/server errors never
   * reach the UI verbatim.
   */
  function describeAuthError(err: unknown, context: 'login' | 'register'): string {
    if (err instanceof ApiError) {
      if (context === 'login' && err.status === 401) {
        return 'شماره موبایل یا رمز عبور اشتباه است';
      }
      if (context === 'register' && err.status === 409) {
        return 'کاربری با این ایمیل یا نام کاربری قبلاً ثبت‌نام کرده است';
      }
      if (err.status === 400) {
        return err.message || 'اطلاعات وارد شده معتبر نیست';
      }
    }
    return 'خطایی رخ داد. لطفاً دوباره تلاش کنید';
  }

  /* ── Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLFormErr('');

    let ok = true;
    if (!/^09\d{9}$/.test(lPhone)) { setLPhErr('شماره موبایل معتبر وارد کنید'); ok = false; } else setLPhErr('');
    if (!lPass || lPass.length < 6) { setLPaErr('رمز عبور باید حداقل ۶ کاراکتر باشد'); ok = false; } else setLPaErr('');
    if (!ok) return;

    try {
      await login({ phoneNumber: lPhone, password: lPass });
      router.push('/');
    } catch (err) {
      setLFormErr(describeAuthError(err, 'login'));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRFormErr('');

    let ok = true;
    if (!rName) { setRNameErr('نام خود را وارد کنید'); ok = false; } else setRNameErr('');
    if (!/^\S+@\S+\.\S+$/.test(rEmail)) { setREmailErr('ایمیل معتبر وارد کنید'); ok = false; } else setREmailErr('');
    if (!rUsername || rUsername.length < 4) { setRUsernameErr('نام کاربری باید حداقل ۴ کاراکتر باشد'); ok = false; } else setRUsernameErr('');
    if (!/^09\d{9}$/.test(rPhone)) { setRPhErr('شماره موبایل معتبر وارد کنید'); ok = false; } else setRPhErr('');
    if (!rPass || rPass.length < 8) { setRPaErr('رمز عبور باید حداقل ۸ کاراکتر باشد'); ok = false; } else setRPaErr('');
    if (rConfirm !== rPass) { setRCoErr('رمز عبور و تکرار آن یکسان نیستند'); ok = false; } else setRCoErr('');
    if (!rTerms) { setRTermsErr('پذیرش قوانین الزامی است'); ok = false; } else setRTermsErr('');
    if (!ok) return;

    try {
      await registerAndLogin({
        email: rEmail,
        username: rUsername,
        phoneNumber: rPhone,
        password: rPass,
      });
      router.push('/');
    } catch (err) {
      setRFormErr(describeAuthError(err, 'register'));
    }
  };
  console.log('Google client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

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

          {lFormErr && <div className="lgn-form-error" role="alert">{lFormErr}</div>}

          <form onSubmit={handleLogin} noValidate>
            <div className={`lgn-field${lPhErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="l-phone">شماره موبایل</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-phone lgn-input-icon" />
                <input id="l-phone" type="tel" inputMode="numeric" placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  autoComplete="tel"
                  className="lgn-input" value={lPhone} onChange={e => setLPhone(e.target.value)} />
              </div>
              {lPhErr && <span className="lgn-error">{lPhErr}</span>}
            </div>

            <div className={`lgn-field${lPaErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="l-pass">رمز عبور</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-lock lgn-input-icon" />
                <input id="l-pass" type={showPass ? 'text' : 'password'} placeholder="رمز عبور خود را وارد کنید"
                  autoComplete="current-password"
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

            <button type="submit" className="lgn-btn" disabled={isLoginPending}>
              <i className="bi bi-box-arrow-in-right" /> {isLoginPending ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          <div className="lgn-divider">یا</div>
          <p className="lgn-switch">
            حساب کاربری ندارید؟
            <button type="button" onClick={() => switchMode('register')}>ثبت نام کنید</button>
          </p>
        </div>
        <div className="lgn-google-wrap">
{mode === 'login' && (
  <div className="lgn-google-wrap">
    <GoogleLogin onSuccess={handleGoogleSuccess} onError={()=>setGoogleErr("true")} text="continue_with" />
    {googleErr && <span className="lgn-error">{googleErr}</span>}
  </div>
)}
  {googleErr && <span className="lgn-error">{googleErr}</span>}
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

          {rFormErr && <div className="lgn-form-error" role="alert">{rFormErr}</div>}

          <form onSubmit={handleRegister} noValidate>
            <div className={`lgn-field${rNameErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="r-name">نام و نام خانوادگی</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-person lgn-input-icon" />
                <input id="r-name" type="text" placeholder="علی محمدی"
                  autoComplete="name"
                  className="lgn-input" value={rName} onChange={e => setRName(e.target.value)} />
              </div>
              {rNameErr && <span className="lgn-error">{rNameErr}</span>}
            </div>

            {/* Added: your register API requires email + username; the
                original form didn't collect either. Remove this block
                if your backend contract has actually changed. */}
            <div className="lgn-row-2">
              <div className={`lgn-field${rEmailErr ? ' has-error' : ''}`}>
                <label className="lgn-label" htmlFor="r-email">ایمیل</label>
                <div className="lgn-input-wrap">
                  <i className="bi bi-envelope lgn-input-icon" />
                  <input id="r-email" type="email" placeholder="you@example.com"
                    autoComplete="email"
                    className="lgn-input" value={rEmail} onChange={e => setREmail(e.target.value)} />
                </div>
                {rEmailErr && <span className="lgn-error">{rEmailErr}</span>}
              </div>

              <div className={`lgn-field${rUsernameErr ? ' has-error' : ''}`}>
                <label className="lgn-label" htmlFor="r-username">نام کاربری</label>
                <div className="lgn-input-wrap">
                  <i className="bi bi-at lgn-input-icon" />
                  <input id="r-username" type="text" placeholder="johndoe99"
                    autoComplete="username"
                    className="lgn-input" value={rUsername} onChange={e => setRUsername(e.target.value)} />
                </div>
                {rUsernameErr && <span className="lgn-error">{rUsernameErr}</span>}
              </div>
            </div>

            <div className={`lgn-field${rPhErr ? ' has-error' : ''}`}>
              <label className="lgn-label" htmlFor="r-phone">شماره موبایل</label>
              <div className="lgn-input-wrap">
                <i className="bi bi-phone lgn-input-icon" />
                <input id="r-phone" type="tel" inputMode="numeric" placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  autoComplete="tel"
                  className="lgn-input" value={rPhone} onChange={e => setRPhone(e.target.value)} />
              </div>
              {rPhErr && <span className="lgn-error">{rPhErr}</span>}
            </div>

            <div className="lgn-row-2">
              <div className={`lgn-field${rPaErr ? ' has-error' : ''}`}>
                <label className="lgn-label" htmlFor="r-pass">رمز عبور</label>
                <div className="lgn-input-wrap">
                  <i className="bi bi-lock lgn-input-icon" />
                  <input id="r-pass" type={showPass ? 'text' : 'password'} placeholder="حداقل ۸ کاراکتر"
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
            {rTermsErr && <span className="lgn-error">{rTermsErr}</span>}

            <button type="submit" className="lgn-btn" disabled={isRegisterPending}>
              <i className="bi bi-person-check-fill" /> {isRegisterPending ? 'در حال ثبت‌نام...' : 'ثبت نام'}
            </button>
          </form>
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => setGoogleErr('ورود با گوگل ناموفق بود. دوباره تلاش کنید')}
  text="continue_with"
  width="100%"
/>
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
