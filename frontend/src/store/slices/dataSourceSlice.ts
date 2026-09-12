import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DataSourceStatus } from '@shared/types';
import { env } from '@/config/env';

interface DataSourceState {
  status: DataSourceStatus;
}

const initialState: DataSourceState = {
  status: env.dataSource === 'local' ? 'local' : 'unknown',
};

const dataSourceSlice = createSlice({
  name: 'dataSource',
  initialState,
  reducers: {
    setDataSourceStatus(state, action: PayloadAction<DataSourceStatus>) {
      state.status = action.payload;
    },
  },
});

export const { setDataSourceStatus } = dataSourceSlice.actions;
export const dataSourceReducer = dataSourceSlice.reducer;
