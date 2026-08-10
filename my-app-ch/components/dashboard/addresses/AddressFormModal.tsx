'use client';

import { useState } from 'react';
import '@/styles/components/dashboard/address-modal.css';
import { useAddresses } from '@/hooks/useAddresses';
import { ApiError } from '@/lib/auth/authFetch';
import { IRAN_PROVINCES } from '@/utils/iranProvinces';
import { AddressIconType, UserAddress } from '@/lib/addresses/addresses.api';

interface AddressFormModalProps {
  /** Pass an existing address to edit it, or omit/null to create a new one. */
  address?: UserAddress | null;
  onClose: () => void;
}

const TAG_OPTIONS: { value: AddressIconType; label: string; icon: string }[] = [
  { value: 'home', label: 'خانه', icon: 'bi-house' },
  { value: 'office', label: 'محل کار', icon: 'bi-briefcase' },
  { value: 'warehouse', label: 'انبار', icon: 'bi-box-seam' },
];

export default function AddressFormModal({ address, onClose }: AddressFormModalProps) {
  const isEdit = Boolean(address);
  const { create, update, isSaving } = useAddresses();

  const [icon, setIcon] = useState<AddressIconType>(address?.icon ?? 'home');
  const [name, setName] = useState(address?.name ?? '');
  const [phone, setPhone] = useState(address?.phone ?? '');
  const [province, setProvince] = useState(address?.province ?? '');
  const [city, setCity] = useState(address?.city ?? '');
  const [addressLine, setAddressLine] = useState(address?.addressLine ?? '');
  const [postalCode, setPostalCode] = useState(address?.postalCode ?? '');
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const tagLabel = TAG_OPTIONS.find((t) => t.value === icon)?.label ?? 'خانه';

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = 'نام تحویل‌گیرنده را وارد کنید';
    if (!/^09\d{9}$/.test(phone)) next.phone = 'شماره موبایل معتبر نیست';
    if (!province) next.province = 'استان را انتخاب کنید';
    if (!city.trim()) next.city = 'شهر را وارد کنید';
    if (!addressLine.trim()) next.addressLine = 'آدرس را وارد کنید';
    if (!/^\d{10}$/.test(postalCode)) next.postalCode = 'کد پستی باید ۱۰ رقم باشد';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    const payload = {
      tag: tagLabel,
      icon,
      name: name.trim(),
      phone,
      province,
      city: city.trim(),
      addressLine: addressLine.trim(),
      postalCode,
      isDefault,
    };

    try {
      if (isEdit && address) {
        await update({ id: address.id, payload });
      } else {
        await create(payload);
      }
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('خطایی رخ داد. لطفاً دوباره تلاش کنید');
      }
    }
  }

  return (
    <div
      className="addr-modal-overlay"
      onMouseDown={(e) => {
        // Close only on a genuine backdrop click, not a click that
        // started inside the modal and was dragged out (text
        // selection dragging outside shouldn't accidentally close it).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="addr-modal" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="addr-modal-title">
        <div className="addr-modal__header">
          <div>
            <h2 className="addr-modal__title" id="addr-modal-title">
              {isEdit ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
            </h2>
            <p className="addr-modal__subtitle">
              {isEdit ? 'اطلاعات آدرس خود را به‌روزرسانی کنید' : 'اطلاعات آدرس جدید را وارد کنید'}
            </p>
          </div>
          <button type="button" className="addr-modal__close-btn" onClick={onClose} aria-label="بستن">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form className="addr-modal__form" onSubmit={handleSubmit} noValidate>
          {formError && <div className="addr-modal__form-error" role="alert">{formError}</div>}

          <div className="addr-modal__row">
            <div className="addr-modal__field">
              <label className="addr-modal__label" htmlFor="addr-tag">
                نام آدرس <span className="addr-modal__label-req">*</span>
              </label>
              <div className="addr-modal__input-wrap">
                <select
                  id="addr-tag"
                  className="addr-modal__select"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value as AddressIconType)}
                >
                  {TAG_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <i className={`bi ${TAG_OPTIONS.find((t) => t.value === icon)?.icon}`} />
              </div>
            </div>

            <div className="addr-modal__field">
              <label className="addr-modal__label" htmlFor="addr-name">
                نام تحویل گیرنده <span className="addr-modal__label-req">*</span>
              </label>
              <div className="addr-modal__input-wrap">
                <input
                  id="addr-name"
                  className={`addr-modal__input${errors.name ? ' addr-modal__input--error' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد رضایی"
                />
                <i className="bi bi-person" />
              </div>
              {errors.name && <span className="addr-modal__error">{errors.name}</span>}
            </div>

            <div className="addr-modal__field">
              <label className="addr-modal__label" htmlFor="addr-phone">
                شماره موبایل <span className="addr-modal__label-req">*</span>
              </label>
              <div className="addr-modal__input-wrap">
                <input
                  id="addr-phone"
                  type="tel"
                  inputMode="numeric"
                  className={`addr-modal__input${errors.phone ? ' addr-modal__input--error' : ''}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
                <i className="bi bi-telephone" />
              </div>
              {errors.phone && <span className="addr-modal__error">{errors.phone}</span>}
            </div>
          </div>

          <div className="addr-modal__row--two addr-modal__row">
            <div className="addr-modal__field">
              <label className="addr-modal__label" htmlFor="addr-province">
                استان <span className="addr-modal__label-req">*</span>
              </label>
              <div className="addr-modal__input-wrap">
                <select
                  id="addr-province"
                  className={`addr-modal__select${errors.province ? ' addr-modal__input--error' : ''}`}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value="">انتخاب کنید</option>
                  {IRAN_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <i className="bi bi-map" />
              </div>
              {errors.province && <span className="addr-modal__error">{errors.province}</span>}
            </div>

            <div className="addr-modal__field">
              <label className="addr-modal__label" htmlFor="addr-city">
                شهر <span className="addr-modal__label-req">*</span>
              </label>
              <div className="addr-modal__input-wrap">
                <input
                  id="addr-city"
                  className={`addr-modal__input${errors.city ? ' addr-modal__input--error' : ''}`}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="تهران"
                />
                <i className="bi bi-buildings" />
              </div>
              {errors.city && <span className="addr-modal__error">{errors.city}</span>}
            </div>
          </div>

          <div className="addr-modal__field">
            <label className="addr-modal__label" htmlFor="addr-line">
              آدرس <span className="addr-modal__label-req">*</span>
            </label>
            <div className="addr-modal__input-wrap">
              <textarea
                id="addr-line"
                className={`addr-modal__input${errors.addressLine ? ' addr-modal__input--error' : ''}`}
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="خیابان، کوچه، پلاک، واحد"
                rows={2}
              />
              <i className="bi bi-geo-alt" style={{ top: 14, transform: 'none' }} />
            </div>
            {errors.addressLine && <span className="addr-modal__error">{errors.addressLine}</span>}
          </div>

          <div className="addr-modal__field">
            <label className="addr-modal__label" htmlFor="addr-postal">
              کد پستی <span className="addr-modal__label-req">*</span>
            </label>
            <div className="addr-modal__input-wrap">
              <input
                id="addr-postal"
                inputMode="numeric"
                className={`addr-modal__input${errors.postalCode ? ' addr-modal__input--error' : ''}`}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="۱۹۸۷۶۵۴۳۲۱"
              />
              <i className="bi bi-mailbox" />
            </div>
            {errors.postalCode && <span className="addr-modal__error">{errors.postalCode}</span>}
          </div>

          <div className="addr-modal__toggle-row">
            <label className="addr-modal__toggle-label" htmlFor="addr-default">
              این آدرس، آدرس پیش‌فرض باشد
            </label>
            <label className="addr-modal__switch">
              <input
                id="addr-default"
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <span className="addr-modal__switch-track" />
            </label>
          </div>

          <div className="addr-modal__actions">
            <button type="submit" className="addr-modal__save-btn" disabled={isSaving}>
              {isSaving ? 'در حال ذخیره...' : isEdit ? 'ذخیره تغییرات' : 'افزودن آدرس'}
            </button>
            <button type="button" className="addr-modal__cancel-btn" onClick={onClose} disabled={isSaving}>
              لغو
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
