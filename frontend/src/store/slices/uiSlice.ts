import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  mobileNavOpen: boolean;
  searchOpen: boolean;
  cartDrawerOpen: boolean;
}

const initialState: UiState = {
  mobileNavOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    setCartDrawerOpen(state, action: PayloadAction<boolean>) {
      state.cartDrawerOpen = action.payload;
    },
  },
});

export const { setMobileNavOpen, setSearchOpen, setCartDrawerOpen } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
