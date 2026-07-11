'use client';

import { Address } from "@/interfaces/dashboard/address/types";
import AddressIcon from "./AddressIcon";



interface AddressCardProps {
  address: Address;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <article className="addr-card">
      {/* Top row: dots menu + label + icon */}
      <div className="addr-card__top">
        <button type="button" className="addr-card__menu-btn" aria-label="گزینه‌ها">
          <span className="addr-card__dots">⋮</span>
        </button>

        <div className="addr-card__label-group">
          <h3 className="addr-card__label">{address.label}</h3>
          {address.isDefault && (
            <span className="addr-card__default-badge">
              <i className="bi bi-check2" aria-hidden="true" /> پیش فرض
            </span>
          )}
        </div>

        <AddressIcon variant={address.icon} />
      </div>

      {/* Body */}
      <div className="addr-card__body">
        <p className="addr-card__name">{address.recipientName}</p>
        <p className="addr-card__address">{address.fullAddress}</p>
        <p className="addr-card__phone" dir="ltr">{address.phone}</p>
      </div>

      {/* Actions */}
      <div className="addr-card__actions">
        <button
          type="button"
          className="addr-card__delete-btn"
          onClick={() => onDelete(address.id)}
          aria-label={`حذف آدرس ${address.label}`}
        >
          <i className="bi bi-trash" aria-hidden="true" /> حذف
        </button>
        <button
          type="button"
          className="addr-card__edit-btn"
          onClick={() => onEdit(address.id)}
          aria-label={`ویرایش آدرس ${address.label}`}
        >
          <i className="bi bi-pencil" aria-hidden="true" /> ویرایش
        </button>
      </div>
    </article>
  );
}
