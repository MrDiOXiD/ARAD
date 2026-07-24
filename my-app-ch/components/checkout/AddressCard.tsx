import { CheckoutAddress } from "@/interfaces/checkout/types";

interface AddressCardProps {
  address: CheckoutAddress;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function AddressCard({ address, selected, onSelect, onEdit }: AddressCardProps) {
  return (
    <div
      className={`addr-card ${selected ? 'addr-card--selected' : ''}`}
      onClick={() => onSelect(address.id)}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
    >
      <div className="addr-card__top">
        <span className="addr-card__tag">{address.tag}</span>
        <span className="addr-card__radio">
          <span className="addr-card__radio-dot" />
        </span>
      </div>
      <div className="addr-card__body">
        <div className="addr-card__name">{address.name}</div>
        <div>{address.phone}</div>
        <div>{address.addressLine}</div>
        <div className="addr-card__postal">کدپستی: {address.postalCode}</div>
      </div>
      <button
        type="button"
        className="addr-card__edit-btn"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(address.id);
        }}
      >
        <i className="bi bi-pencil" />
        ویرایش
      </button>
    </div>
  );
}
