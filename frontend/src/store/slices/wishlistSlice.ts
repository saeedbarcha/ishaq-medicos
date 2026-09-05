import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = { productIds: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      if (state.productIds.includes(action.payload)) {
        state.productIds = state.productIds.filter((id) => id !== action.payload);
      } else {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },
  },
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
