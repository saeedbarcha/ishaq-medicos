import type { DataSourceMode } from '@shared/types';

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5050/api/v1',
  dataSource: (import.meta.env.VITE_DATA_SOURCE ?? 'auto') as DataSourceMode,
  demoEnabled: import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false',
  siteUrl: import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173',
  isDev: import.meta.env.DEV,
  appEnv: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE,
};
