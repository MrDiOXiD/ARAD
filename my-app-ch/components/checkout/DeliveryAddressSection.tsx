import { CheckoutAddress } from '@/interfaces/checkout/types';
import AddressCard from './AddressCard';

interface DeliveryAddressSectionProps {
  addresses: CheckoutAddress[];
  selectedId: string;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onAddNew: () => void;
}

export default function DeliveryAddressSection({
  addresses,
  selectedId,
  onSelect,
  onEdit,
  onAddNew,
}: DeliveryAddressSectionProps) {
  return (
    <div className="checkout-card">
      <div className="checkout-card__header">
        <span className="checkout-card__title">
          <i className="bi bi-geo-alt" />
          ۱. آدرس تحویل
        </span>
        <button type="button" className="checkout-card__add-btn" onClick={onAddNew}>
          <i className="bi bi-plus-lg" />
          افزودن آدرس جدید
        </button>
      </div>
      <div className="addr-grid">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={address.id === selectedId}
            onSelect={onSelect}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
