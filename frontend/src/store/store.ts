import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { persistStorage } from './persistStorage';
import { baseApi } from './api/baseApi';
import { authReducer } from './slices/authSlice';
import { cartReducer } from './slices/cartSlice';
import { checkoutReducer } from './slices/checkoutSlice';
import { dataSourceReducer } from './slices/dataSourceSlice';
import { recentlyViewedReducer } from './slices/recentlyViewedSlice';
import { uiReducer } from './slices/uiSlice';
import { wishlistReducer } from './slices/wishlistSlice';
import './api/catalogApi';
import './api/storeApi';
import './api/adminApi';

const persistConfig = {
  key: 'ishaq-medical',
  storage: persistStorage,
  whitelist: ['cart', 'wishlist', 'recentlyViewed', 'auth', 'checkout'],
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
  ui: uiReducer,
  checkout: checkoutReducer,
  recentlyViewed: recentlyViewedReducer,
  dataSource: dataSourceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // redux-persist wraps the root state; RTK Query middleware types do not overlap PersistPartial.
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware) as unknown as ReturnType<typeof getDefault>,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
