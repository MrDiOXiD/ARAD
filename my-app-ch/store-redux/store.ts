import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import { saveCartToStorage } from './cartPersistence';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // After every action, sync cart items to localStorage.
      // Runs only on the client (saveCartToStorage is SSR-safe).
      () => (next) => (action) => {
        const result = next(action);
        const state = store.getState();
        saveCartToStorage(state.cart.items);
        return result;
      },
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
