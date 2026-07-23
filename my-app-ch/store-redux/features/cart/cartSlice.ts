import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/interfaces/cart/types';
import { clearCartFromStorage } from '@/store-redux/cartPersistence';

interface CartState {
  items: CartItem[];
  isInitialized: boolean;
}

const initialState: CartState = {
  items: [],
  isInitialized: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Seed from localStorage (called by StoreProvider on mount)
    initializeCart: (state, action: PayloadAction<CartItem[]>) => {
      if (!state.isInitialized) {
        state.items = action.payload;
        state.isInitialized = true;
      }
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    changeQuantity: (state, action: PayloadAction<{ id: number; delta: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + action.payload.delta);
      }
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    // Also wipes localStorage so the cleared cart doesn't reload on next visit
    clearCart: (state) => {
      state.items = [];
      state.isInitialized = false;
      clearCartFromStorage();
    },
  },
});

export const {
  initializeCart,
  addToCart,
  changeQuantity,
  updateQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
