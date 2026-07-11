import { Address } from "@/interfaces/dashboard/address/types";
import { JSX } from "react/jsx-runtime";

const ICONS: Record<Address['icon'], JSX.Element> = {
  home: (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  office: (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <rect x={3} y={3} width={18} height={18} rx={1} />
      <path d="M9 3v18M3 9h6M3 15h6M15 9h3M15 13h3M15 17h3" />
    </svg>
  ),
  warehouse: (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <rect x={8} y={13} width={8} height={8} />
    </svg>
  ),
};

export default function AddressIcon({ variant }: { variant: Address['icon'] }) {
  return <span className="addr-card__icon">{ICONS[variant]}</span>;
}
