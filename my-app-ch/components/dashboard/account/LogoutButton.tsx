'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // TODO: clear session / call sign-out API
    router.push('/');
  };

  return confirming ? (
    <div className="ac-logout-confirm">
      <p className="ac-logout-confirm__text">مطمئنی می‌خوای خارج بشی؟</p>
      <div className="ac-logout-confirm__actions">
        <button type="button" className="ac-btn ac-btn--danger" onClick={handleLogout}>
          بله، خروج
        </button>
        <button type="button" className="ac-btn ac-btn--ghost" onClick={() => setConfirming(false)}>
          انصراف
        </button>
      </div>
    </div>
  ) : (
    <button type="button" className="ac-btn ac-btn--logout" onClick={() => setConfirming(true)}>
      <i className="bi bi-box-arrow-left" aria-hidden="true" />
      خروج از حساب
    </button>
  );
}
