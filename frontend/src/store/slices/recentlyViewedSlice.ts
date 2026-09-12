import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RecentlyViewedState {
  productIds: string[];
}

const initialState: RecentlyViewedState = { productIds: [] };

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    rememberProduct(state, action: PayloadAction<string>) {
      state.productIds = [action.payload, ...state.productIds.filter((id) => id !== action.payload)].slice(0, 8);
    },
  },
});

export const { rememberProduct } = recentlyViewedSlice.actions;
export const recentlyViewedReducer = recentlyViewedSlice.reducer;
