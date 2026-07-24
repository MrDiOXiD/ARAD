import { configureStore, Middleware } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import { saveCartToStorage } from './cartPersistence';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // 1. Add the missing 'storeAPI' parameter
      // 2. Cast the entire function as Middleware to satisfy TypeScript
      ((storeAPI) => (next) => (action) => {
        const result = next(action);
        
        // We continue using 'store.getState()' here to avoid a circular 
        // type dependency issue that often happens with 'storeAPI'
        const state = store.getState(); 
        
        saveCartToStorage(state.cart.items);
        return result;
      }) as Middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;