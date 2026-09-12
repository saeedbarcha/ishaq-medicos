import { baseApi } from './baseApi';
import { mergeAdminUsers } from '@/repositories/staffRepository';
import type { AdminMetrics, ApiSuccess, PaginationMeta } from '@shared/types';

type ListResponse<T> = ApiSuccess<T[]> & { meta?: PaginationMeta };

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminLogin: build.mutation<
      ApiSuccess<{ user: { id: string; name: string; email: string; role: string }; tokens: { access: { token: string }; refresh: { token: string } } }>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: '/admin/login', method: 'POST', body }),
    }),
    getAdminDashboard: build.query<ApiSuccess<AdminMetrics>, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Admin'],
    }),
    getAdminProducts: build.query<ListResponse<Record<string, unknown>>, { page?: number; search?: string } | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params && params.page) search.set('page', String(params.page));
        if (params && params.search) search.set('search', params.search);
        search.set('limit', '50');
        return `/admin/products?${search.toString()}`;
      },
      providesTags: ['Product', 'Admin'],
    }),
    createAdminProduct: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/products', method: 'POST', body }),
      invalidatesTags: ['Product', 'Admin'],
    }),
    updateAdminProduct: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/products/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Product', 'Admin'],
    }),
    deleteAdminProduct: build.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({ url: `/admin/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product', 'Admin'],
    }),
    getAdminCategories: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/categories?limit=100',
      providesTags: ['Category', 'Admin'],
    }),
    createAdminCategory: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/categories', method: 'POST', body }),
      invalidatesTags: ['Category', 'Admin'],
    }),
    updateAdminCategory: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/categories/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Category', 'Admin'],
    }),
    deleteAdminCategory: build.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({ url: `/admin/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category', 'Admin'],
    }),
    getAdminBrands: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/brands?limit=100',
      providesTags: ['Brand', 'Admin'],
    }),
    createAdminBrand: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/brands', method: 'POST', body }),
      invalidatesTags: ['Brand', 'Admin'],
    }),
    updateAdminBrand: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/brands/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Brand', 'Admin'],
    }),
    getAdminOrders: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/orders?limit=50',
      providesTags: ['Order', 'Admin'],
    }),
    updateAdminOrder: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/orders/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Order', 'Admin'],
    }),
    getAdminPrescriptions: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/prescriptions?limit=50',
      providesTags: ['Prescription', 'Admin'],
    }),
    updateAdminPrescription: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/prescriptions/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Prescription', 'Admin'],
    }),
    getAdminInventory: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/inventory?limit=50',
      providesTags: ['Admin'],
    }),
    createAdminInventory: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/inventory', method: 'POST', body }),
      invalidatesTags: ['Admin', 'Product'],
    }),
    getAdminBanners: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/banners?limit=50',
      providesTags: ['Admin'],
    }),
    createAdminBanner: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/banners', method: 'POST', body }),
      invalidatesTags: ['Admin'],
    }),
    updateAdminBanner: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/banners/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Admin'],
    }),
    deleteAdminBanner: build.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({ url: `/admin/banners/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Admin'],
    }),
    getAdminBlog: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/blog?limit=50',
      providesTags: ['Blog', 'Admin'],
    }),
    createAdminBlog: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/blog', method: 'POST', body }),
      invalidatesTags: ['Blog', 'Admin'],
    }),
    updateAdminBlog: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/blog/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Blog', 'Admin'],
    }),
    deleteAdminBlog: build.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({ url: `/admin/blog/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Blog', 'Admin'],
    }),
    getAdminFaqs: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/faqs?limit=100',
      providesTags: ['Admin'],
    }),
    createAdminFaq: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/faqs', method: 'POST', body }),
      invalidatesTags: ['Admin'],
    }),
    updateAdminFaq: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/faqs/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Admin'],
    }),
    deleteAdminFaq: build.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({ url: `/admin/faqs/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Admin'],
    }),
    getAdminZones: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/delivery-zones?limit=50',
      providesTags: ['Admin'],
    }),
    createAdminZone: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/delivery-zones', method: 'POST', body }),
      invalidatesTags: ['Admin'],
    }),
    getAdminReviews: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/reviews?limit=50',
      providesTags: ['Review', 'Admin'],
    }),
    updateAdminReview: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/reviews/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Review', 'Admin'],
    }),
    getAdminInquiries: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/inquiries?limit=50',
      providesTags: ['Admin'],
    }),
    updateAdminInquiry: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/inquiries/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Admin'],
    }),
    getAdminSettings: build.query<ApiSuccess<Record<string, unknown>>, void>({
      query: () => '/admin/settings',
      providesTags: ['Store', 'Admin'],
    }),
    updateAdminSettings: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/settings', method: 'PATCH', body }),
      invalidatesTags: ['Store', 'Admin'],
    }),
    getAdminUsers: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/users?limit=50',
      transformResponse: (response: ListResponse<Record<string, unknown>>) => ({
        ...response,
        data: mergeAdminUsers((response.data ?? []) as Record<string, unknown>[]),
      }),
      providesTags: ['Admin', 'Team'],
    }),
    createAdminUser: build.mutation<ApiSuccess<Record<string, unknown>>, Record<string, unknown>>({
      query: (body) => ({ url: '/admin/users', method: 'POST', body }),
      invalidatesTags: ['Admin', 'Team'],
    }),
    updateAdminUser: build.mutation<ApiSuccess<Record<string, unknown>>, { id: string; body: Record<string, unknown> }>({
      query: ({ id, body }) => ({ url: `/admin/users/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Admin', 'Team'],
    }),
    deleteAdminUser: build.mutation<ApiSuccess<{ id: string }>, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Admin', 'Team'],
    }),
    getAdminAuditLogs: build.query<ListResponse<Record<string, unknown>>, void>({
      query: () => '/admin/audit-logs?limit=40',
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useGetAdminDashboardQuery,
  useGetAdminProductsQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
  useGetAdminCategoriesQuery,
  useCreateAdminCategoryMutation,
  useUpdateAdminCategoryMutation,
  useDeleteAdminCategoryMutation,
  useGetAdminBrandsQuery,
  useCreateAdminBrandMutation,
  useUpdateAdminBrandMutation,
  useGetAdminOrdersQuery,
  useUpdateAdminOrderMutation,
  useGetAdminPrescriptionsQuery,
  useUpdateAdminPrescriptionMutation,
  useGetAdminInventoryQuery,
  useCreateAdminInventoryMutation,
  useGetAdminBannersQuery,
  useCreateAdminBannerMutation,
  useUpdateAdminBannerMutation,
  useDeleteAdminBannerMutation,
  useGetAdminBlogQuery,
  useCreateAdminBlogMutation,
  useUpdateAdminBlogMutation,
  useDeleteAdminBlogMutation,
  useGetAdminFaqsQuery,
  useCreateAdminFaqMutation,
  useUpdateAdminFaqMutation,
  useDeleteAdminFaqMutation,
  useGetAdminZonesQuery,
  useCreateAdminZoneMutation,
  useGetAdminReviewsQuery,
  useUpdateAdminReviewMutation,
  useGetAdminInquiriesQuery,
  useUpdateAdminInquiryMutation,
  useGetAdminSettingsQuery,
  useUpdateAdminSettingsMutation,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminAuditLogsQuery,
} = adminApi;
