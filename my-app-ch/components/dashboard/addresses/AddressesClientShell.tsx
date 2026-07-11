'use client';

import { useState } from 'react';
import AddressCard from './AddressCard';
import { Address } from '@/interfaces/dashboard/address/types';
import { ADDRESSES } from '@/utils/mockData/addressData';


export default function AddressesClientShell() {
  const [addresses, setAddresses] = useState<Address[]>(ADDRESSES);

  const handleDelete = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  const handleEdit = (id: string) => {
    // TODO: open edit modal / navigate to edit page
    console.log('Edit address:', id);
  };

  const handleAdd = () => {
    // TODO: open add modal / navigate to add page
    console.log('Add new address');
  };

  return (
    <div className="addr-page" dir="rtl">
      {/* Section header */}
      <div className="addr-header">
        <div className="addr-header__title-group">
          <h1 className="addr-header__title">
            آدرس ها
            <i className="bi bi-geo-alt addr-header__icon" aria-hidden="true" />
          </h1>
          <p className="addr-header__subtitle">آدرس های خود را مدیریت کنید</p>
        </div>

        <button type="button" className="addr-header__add-btn" onClick={handleAdd}>
          <i className="bi bi-plus-lg" aria-hidden="true" />
          افزودن آدرس جدید
        </button>
      </div>

      {/* Grid */}
      {addresses.length === 0 ? (
        <div className="addr-empty" role="status">
          <i className="bi bi-geo-alt addr-empty__icon" aria-hidden="true" />
          <p>هنوز آدرسی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="addr-grid">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
