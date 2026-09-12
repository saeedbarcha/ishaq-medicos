import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { env } from '@/config/env';
import { fulfillLocal } from '@/lib/data-source/localFulfill';
import { setDataSourceStatus } from '@/store/slices/dataSourceSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiUrl,
  timeout: 8000,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Accept', 'application/json');
    const token = (getState() as { auth?: { accessToken?: string | null } }).auth?.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

function isFailure(result: { error?: FetchBaseQueryError }) {
  if (!result.error) return false;
  const status = result.error.status;
  if (status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR' || status === 'PARSING_ERROR') return true;
  if (typeof status === 'number' && status >= 500) return true;
  return false;
}

function pathOf(args: string | FetchArgs) {
  return typeof args === 'string' ? args : args.url;
}

function methodOf(args: string | FetchArgs) {
  return typeof args === 'string' ? 'GET' : (args.method ?? 'GET').toUpperCase();
}

function listSize(payload: unknown) {
  if (!payload || typeof payload !== 'object') return 0;
  const inner = (payload as { data?: unknown }).data;
  if (Array.isArray(inner)) return inner.length;
  if (inner && typeof inner === 'object' && Array.isArray((inner as { items?: unknown[] }).items)) {
    return (inner as { items: unknown[] }).items.length;
  }
  return 0;
}

function isSparseCatalogGet(args: string | FetchArgs, payload: unknown) {
  const method = methodOf(args);
  const path = pathOf(args);
  if (method !== 'GET') return false;
  if (path.includes('/admin')) return false;
  if (/\/(products|blog|brands|categories)\/[^/?]+/.test(path)) return false;
  const catalog =
    path.includes('/products') ||
    path.includes('/search') ||
    path.includes('/brands') ||
    path.includes('/categories') ||
    path.includes('/blog') ||
    path.includes('/deals') ||
    path.includes('/reviews') ||
    path.includes('/faqs') ||
    path.includes('/banners') ||
    path.includes('/team');
  if (!catalog) return false;
  const local = fulfillLocal(args);
  if ('error' in local) return false;
  const localCount = listSize(local.data);
  const apiCount = listSize(payload);
  if (apiCount === 0 && localCount > 0) return true;
  return localCount > apiCount + 3;
}

export const smartBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extra,
) => {
  const mode = env.dataSource;

  if (mode === 'local') {
    api.dispatch(setDataSourceStatus('local'));
    return fulfillLocal(args);
  }

  const result = await rawBaseQuery(args, api, extra);

  if (!result.error) {
    if (mode === 'auto' && isSparseCatalogGet(args, result.data)) {
      api.dispatch(setDataSourceStatus('fallback'));
      return fulfillLocal(args);
    }
    api.dispatch(setDataSourceStatus('api'));
    return result;
  }

  const state = api.getState() as { auth?: { isDemoSession?: boolean; accessToken?: string | null } };
  const demoAuth =
    Boolean(state.auth?.isDemoSession) ||
    state.auth?.accessToken === 'demo' ||
    state.auth?.accessToken === 'demo-admin';
  const demoFallback = mode === 'auto' && result.error.status === 401 && demoAuth;

  const catalogMiss =
    mode === 'auto' &&
    methodOf(args) === 'GET' &&
    /\/(products|blog|brands|categories)\/[^/?]+/.test(pathOf(args)) &&
    result.error.status === 404;

  if ((mode === 'auto' && isFailure(result)) || demoFallback || catalogMiss) {
    const local = fulfillLocal(args);
    if (!('error' in local)) {
      api.dispatch(setDataSourceStatus('fallback'));
      return local;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: smartBaseQuery,
  tagTypes: [
    'Product',
    'Category',
    'Brand',
    'Store',
    'Blog',
    'Order',
    'Prescription',
    'Review',
    'Admin',
    'Team',
  ],
  endpoints: () => ({}),
});
