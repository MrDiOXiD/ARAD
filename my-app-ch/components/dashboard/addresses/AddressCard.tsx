'use client';

import { UserAddress } from '@/lib/addresses/addresses.api';
import AddressIcon from './AddressIcon';

interface AddressCardProps {
  address: UserAddress;
  onEdit: (id: number) => void;   // was string
  onDelete: (id: number) => void; // was string
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  // Backend stores city and addressLine separately; the card design
  // shows one combined line — join them for display only, the
  // underlying data stays separate (needed for editing/checkout).
  const fullAddress = `${address.city}، ${address.addressLine}`;

  return (
    <article className="addr-card">
      <div className="addr-card__top">
        <button type="button" className="addr-card__menu-btn" aria-label="گزینه‌ها">
          <span className="addr-card__dots">⋮</span>
        </button>

        <div className="addr-card__label-group">
          <h3 className="addr-card__label">{address.tag}</h3>
          {address.isDefault && (
            <span className="addr-card__default-badge">
              <i className="bi bi-check2" aria-hidden="true" /> پیش فرض
            </span>
          )}
        </div>

        <AddressIcon variant={address.icon} />
      </div>

      <div className="addr-card__body">
        <p className="addr-card__name">{address.name}</p>
        <p className="addr-card__address">{fullAddress}</p>
        <p className="addr-card__phone" dir="ltr">{address.phone}</p>
      </div>

      <div className="addr-card__actions">
        <button
          type="button"
          className="addr-card__delete-btn"
          onClick={() => onDelete(address.id)}
          aria-label={`حذف آدرس ${address.tag}`}
        >
          <i className="bi bi-trash" aria-hidden="true" /> حذف
        </button>
        <button
          type="button"
          className="addr-card__edit-btn"
          onClick={() => onEdit(address.id)}
          aria-label={`ویرایش آدرس ${address.tag}`}
        >
          <i className="bi bi-pencil" aria-hidden="true" /> ویرایش
        </button>
      </div>
    </article>
  );
}
