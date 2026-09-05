import { baseApi } from './baseApi';
import { hydrateProduct, hydrateProducts } from '@/lib/catalog/hydrateProduct';
import type {
  ApiSuccess,
  Brand,
  Category,
  PaginationMeta,
  Product,
  ProductQuery,
  SearchSuggestion,
} from '@shared/types';

function toQuery(params: ProductQuery = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `/products?${qs}` : '/products';
}

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ApiSuccess<Product[]> & { meta: PaginationMeta }, ProductQuery | void>({
      query: (params) => toQuery(params || {}),
      transformResponse: (response: ApiSuccess<Product[]> & { meta: PaginationMeta }) => ({
        ...response,
        data: hydrateProducts(response.data),
      }),
      providesTags: ['Product'],
    }),
    getProduct: build.query<ApiSuccess<{ product: Product; related: Product[] }>, string>({
      query: (slug) => `/products/${slug}`,
      transformResponse: (response: ApiSuccess<{ product: Product; related: Product[] }>) => {
        const product = hydrateProduct(response.data?.product);
        return {
          ...response,
          data: {
            product: product as Product,
            related: hydrateProducts(response.data?.related ?? []),
          },
        };
      },
      providesTags: (_r, _e, slug) => [{ type: 'Product', id: slug }],
    }),
    getCategories: build.query<ApiSuccess<Category[]>, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getCategory: build.query<ApiSuccess<Category>, string>({
      query: (slug) => `/categories/${slug}`,
      providesTags: ['Category'],
    }),
    getBrands: build.query<ApiSuccess<Brand[]>, void>({
      query: () => '/brands',
      providesTags: ['Brand'],
    }),
    getBrand: build.query<ApiSuccess<Brand>, string>({
      query: (slug) => `/brands/${slug}`,
      providesTags: ['Brand'],
    }),
    searchCatalog: build.query<
      ApiSuccess<{ items: Product[]; suggestions: SearchSuggestion[] }> & { meta?: PaginationMeta },
      ProductQuery
    >({
      query: (params) => {
        const search = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
        });
        return `/search?${search.toString()}`;
      },
      transformResponse: (
        response: ApiSuccess<{ items: Product[]; suggestions: SearchSuggestion[] }> & { meta?: PaginationMeta },
      ) => ({
        ...response,
        data: {
          ...response.data,
          items: hydrateProducts(response.data?.items ?? []),
        },
      }),
    }),
    getSuggestions: build.query<ApiSuccess<SearchSuggestion[]>, string>({
      query: (q) => `/search/suggestions?q=${encodeURIComponent(q)}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetBrandsQuery,
  useGetBrandQuery,
  useSearchCatalogQuery,
  useGetSuggestionsQuery,
} = catalogApi;
