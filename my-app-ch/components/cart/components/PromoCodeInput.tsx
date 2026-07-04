'use client';

import { useState } from 'react';

export default function PromoCodeInput() {
  const [code, setCode] = useState('');

  const handleApply = () => {
    // TODO: wire up promo-code validation logic
    console.log('Applying promo code:', code);
  };

  return (
    <div className="promo-input">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="کد تخفیف خود را وارد کنید"
        className="promo-input__field"
        aria-label="کد تخفیف"
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <button
        type="button"
        className="promo-input__apply-btn"
        onClick={handleApply}
        disabled={!code.trim()}
      >
        اعمال
      </button>
    </div>
  );
}
