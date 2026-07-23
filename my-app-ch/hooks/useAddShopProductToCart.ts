import { useCallback } from 'react';
import { ShopProduct } from '@/interfaces/shop/types';
import { addToCart } from '@/store-redux/features/cart/cartSlice';
import { useAppDispatch } from '@/store-redux/hooks';
import { mapShopProductToCartItem } from '@/utils/mapShopProductToCartItem';

export function useAddShopProductToCart() {
  const dispatch = useAppDispatch();

  const handleAddToCart = useCallback(
    (product: ShopProduct, quantity = 1) => {
      const cartItem = mapShopProductToCartItem(product, quantity);
      dispatch(addToCart(cartItem));
    },
    [dispatch],
  );

  return { handleAddToCart };
}