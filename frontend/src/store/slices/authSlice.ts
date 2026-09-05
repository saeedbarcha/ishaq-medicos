import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { demoUsers } from '@/data/users';
import type { DemoUser } from '@shared/types';

interface AuthState {
  user: DemoUser | null;
  isDemoSession: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = { user: null, isDemoSession: false, accessToken: null, refreshToken: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startDemoSession(state, action: PayloadAction<'customer' | 'admin' | 'pharmacist'>) {
      const map = {
        customer: demoUsers[0],
        admin: demoUsers[1],
        pharmacist: demoUsers[2],
      };
      state.user = map[action.payload];
      state.isDemoSession = true;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setSession(
      state,
      action: PayloadAction<{
        user: DemoUser;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.isDemoSession =
        !action.payload.accessToken ||
        action.payload.accessToken === 'demo' ||
        action.payload.accessToken === 'demo-admin';
    },
    logout(state) {
      state.user = null;
      state.isDemoSession = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { startDemoSession, setSession, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
