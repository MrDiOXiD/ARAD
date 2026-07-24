'use client';
import { Middleware } from '@reduxjs/toolkit'; // 1. Add this import at the top
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import { loadCartFromStorage, saveCartToStorage } from './cartPersistence';
import { initializeCart } from './features/cart/cartSlice';

/**
 * Creates the store fresh on the client, rehydrating cart from localStorage.
 * A new store instance per browser tab prevents state leaking between
 * server-rendered requests (Next.js SSR safety).
 */
function makeStore() {
  const store = configureStore({
    reducer: { cart: cartReducer },
   middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          // 2. Add storeAPI and cast as Middleware
          ((storeAPI) => (next) => (action) => {
            const result = next(action);
            
            // 3. Use storeAPI.getState() instead of referencing a global 'store'
            saveCartToStorage(storeAPI.getState().cart.items);
            
            return result;
          }) as Middleware
        ),
  });

  // Rehydrate from localStorage immediately after store creation (client only)
  const saved = loadCartFromStorage();
  if (saved.length > 0) {
    store.dispatch(initializeCart(saved));
  }

  return store;
}

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // useRef ensures makeStore() is called only once per component lifetime
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
