import { authFetch } from '../auth/authFetch';

export type AddressIconType = 'home' | 'office' | 'warehouse';

// Matches UserAddressEntity's actual shape — not the mock Address type.
export interface UserAddress {
  id: number;
  tag: string;
  name: string;
  phone: string;
  city: string;
  addressLine: string;
  postalCode: string;
  isDefault: boolean;
  icon: AddressIconType;
}

export interface CreateAddressPayload {
  tag: string;
  name: string;
  phone: string;
  city: string;
  addressLine: string;
  postalCode: string;
  icon?: AddressIconType;
  isDefault?: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export function getAddresses(): Promise<UserAddress[]> {
  return authFetch<UserAddress[]>('/user/addresses', { method: 'GET' });
}

export function createAddress(payload: CreateAddressPayload): Promise<UserAddress> {
  return authFetch<UserAddress>('/user/addresses', { method: 'POST', body: payload });
}

export function updateAddress(id: number, payload: UpdateAddressPayload): Promise<UserAddress> {
  return authFetch<UserAddress>(`/user/addresses/${id}`, { method: 'PATCH', body: payload });
}

export function deleteAddress(id: number): Promise<{ deleted: boolean }> {
  return authFetch<{ deleted: boolean }>(`/user/addresses/${id}`, { method: 'DELETE' });
}

export function setDefaultAddress(id: number): Promise<UserAddress> {
  return authFetch<UserAddress>(`/user/addresses/${id}/default`, { method: 'PATCH' });
}
