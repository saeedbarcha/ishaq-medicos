/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DATA_SOURCE: string;
  readonly VITE_ENABLE_DEMO_MODE: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
