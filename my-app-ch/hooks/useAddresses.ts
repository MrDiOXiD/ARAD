'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as addressesApi from '@/lib/addresses/addresses.api';
import { useAuth } from '@/context/AuthContext';

const ADDRESSES_KEY = ['addresses'] as const;

export function useAddresses() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: addressesApi.getAddresses,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });

  const removeMutation = useMutation({
    mutationFn: addressesApi.deleteAddress,
    onSuccess: invalidate,
  });

  const createMutation = useMutation({
    mutationFn: addressesApi.createAddress,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: addressesApi.UpdateAddressPayload }) =>
      addressesApi.updateAddress(id, payload),
    onSuccess: invalidate,
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    remove: removeMutation.mutate,
    // *Async variants for the modal — it needs to await the result to
    // know when to close itself / show a server-side error inline,
    // which the fire-and-forget `.mutate` doesn't support directly.
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
