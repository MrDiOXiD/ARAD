'use client';

import { useState } from 'react';
import AddressCard from './AddressCard';
import AddressFormModal from './AddressFormModal';
import { useAddresses } from '@/hooks/useAddresses';
import { UserAddress } from '@/lib/addresses/addresses.api';

export default function AddressesClientShell() {
  const { addresses, isLoading, remove } = useAddresses();
  const [modalState, setModalState] = useState<
    { open: false } | { open: true; address: UserAddress | null }
  >({ open: false });

console.log(addresses);


  const handleDelete = (id: number) => remove(id);
  const handleEdit = (address: UserAddress) => setModalState({ open: true, address });
  const handleAdd = () => setModalState({ open: true, address: null });
  const closeModal = () => setModalState({ open: false });

  if (isLoading) {
    return <div className="addr-page__loading" aria-busy="true" />;
  }

  return (
    <div className="addr-page" dir="rtl">
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
              onEdit={() => handleEdit(address)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalState.open && (
        <AddressFormModal address={modalState.address} onClose={closeModal} />
      )}
    </div>
  );
}
