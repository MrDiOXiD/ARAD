import { useCallback } from 'react';
import { ApiProduct } from '@/interfaces/ProductApi/types';
import { addToCart } from '@/store-redux/features/cart/cartSlice';
import { useAppDispatch } from '@/store-redux/hooks';
import { mapApiProductToCartItem } from '@/utils/mapApiProductToCartItem';

/**
 * Drop-in hook for any component that needs an "Add to cart" action.
 *
 * Usage:
 *   const { handleAddToCart } = useAddToCart();
 *   <button onClick={() => handleAddToCart(apiData, quantity)}>افزودن</button>
 */
export function useAddToCart() {
  const dispatch = useAppDispatch();

  const handleAddToCart = useCallback(
    (product: ApiProduct, quantity = 1) => {
      const cartItem = mapApiProductToCartItem(product, quantity);
      dispatch(addToCart(cartItem));
    },
    [dispatch],
  );

  return { handleAddToCart };
}
