import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PaymentMethod } from '@shared/types';

interface CheckoutState {
  fullName: string;
  phone: string;
  email: string;
  district: string;
  city: string;
  area: string;
  addressLine: string;
  landmark: string;
  deliveryOption: 'delivery' | 'pickup';
  paymentMethod: PaymentMethod;
  coupon: string;
  notes: string;
  agreed: boolean;
}

const initialState: CheckoutState = {
  fullName: '',
  phone: '',
  email: '',
  district: 'Gilgit',
  city: 'Gilgit',
  area: '',
  addressLine: '',
  landmark: '',
  deliveryOption: 'pickup',
  paymentMethod: 'cod',
  coupon: '',
  notes: '',
  agreed: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateCheckout(state, action: PayloadAction<Partial<CheckoutState>>) {
      Object.assign(state, action.payload);
    },
    resetCheckout() {
      return initialState;
    },
  },
});

export const { updateCheckout, resetCheckout } = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
export type { CheckoutState };
