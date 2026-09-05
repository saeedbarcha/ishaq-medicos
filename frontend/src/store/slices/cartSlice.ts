import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@shared/types';
import { productRepository } from '@/repositories/productRepository';

interface CartState {
  items: CartItem[];
  note: string;
}

const initialState: CartState = { items: [], note: '' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ productId: string; quantity?: number }>) {
      const quantity = action.payload.quantity ?? 1;
      const existing = state.items.find((item) => item.productId === action.payload.productId);
      const product = productRepository.getById(action.payload.productId);
      const max = Math.max(product?.stock ?? 99, 0);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, max || existing.quantity + quantity);
      } else {
        state.items.push({
          productId: action.payload.productId,
          quantity: Math.min(quantity, max || quantity),
          addedAt: new Date().toISOString(),
        });
      }
    },
    setCartQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((row) => row.productId === action.payload.productId);
      if (!item) return;
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter((row) => row.productId !== action.payload.productId);
        return;
      }
      item.quantity = action.payload.quantity;
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.productId !== action.payload);
    },
    setCartNote(state, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.note = '';
    },
  },
});

export const { addToCart, setCartQuantity, removeFromCart, setCartNote, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
