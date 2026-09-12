import { baseApi } from './baseApi';
import { mergePublicTeam } from '@/repositories/staffRepository';
import type {
  AdminMetrics,
  ApiSuccess,
  Banner,
  BlogPost,
  Deal,
  DeliveryZone,
  FaqItem,
  Order,
  Review,
  StoreSettings,
  TeamMember,
} from '@shared/types';

export const storeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStoreSettings: build.query<ApiSuccess<StoreSettings>, void>({
      query: () => '/store',
      providesTags: ['Store'],
    }),
    getBanners: build.query<ApiSuccess<Banner[]>, void>({
      query: () => '/banners',
    }),
    getDeals: build.query<ApiSuccess<Deal[]>, void>({
      query: () => '/deals',
    }),
    getDeliveryZones: build.query<ApiSuccess<DeliveryZone[]>, void>({
      query: () => '/delivery-zones',
    }),
    getFaqs: build.query<ApiSuccess<FaqItem[]>, void>({
      query: () => '/faqs',
    }),
    getBlog: build.query<ApiSuccess<BlogPost[]>, void>({
      query: () => '/blog',
      providesTags: ['Blog'],
    }),
    getBlogPost: build.query<ApiSuccess<BlogPost>, string>({
      query: (slug) => `/blog/${slug}`,
      providesTags: ['Blog'],
    }),
    getReviews: build.query<ApiSuccess<Review[]>, string | void>({
      query: (productId) => (productId ? `/reviews?productId=${productId}` : '/reviews'),
      providesTags: ['Review'],
    }),
    getTeam: build.query<ApiSuccess<TeamMember[]>, void>({
      query: () => '/team',
      transformResponse: (response: ApiSuccess<TeamMember[]>) => ({
        ...response,
        data: mergePublicTeam(response.data ?? []),
      }),
      providesTags: ['Team'],
    }),
    getOrders: build.query<ApiSuccess<Order[]>, void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    createOrder: build.mutation<
      ApiSuccess<{ publicRef: string; accessToken: string; status: string; total: number; id: string }>,
      Record<string, unknown>
    >({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    trackOrder: build.query<ApiSuccess<Order>, { ref: string; token?: string }>({
      query: ({ ref, token }) => `/orders/track?ref=${encodeURIComponent(ref)}${token ? `&token=${encodeURIComponent(token)}` : ''}`,
    }),
    login: build.mutation<
      ApiSuccess<{ user: { id: string; name: string; email: string; role: string; phone?: string }; tokens: { access: { token: string }; refresh: { token: string } } }>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getAdminMetrics: build.query<ApiSuccess<AdminMetrics>, void>({
      query: () => '/admin/metrics',
      providesTags: ['Admin'],
    }),
    submitPrescription: build.mutation<ApiSuccess<{ id: string; status: string; isDemo: boolean }>, FormData | Record<string, unknown>>({
      query: (body) => ({ url: '/prescriptions', method: 'POST', body }),
      invalidatesTags: ['Prescription'],
    }),
    submitContact: build.mutation<ApiSuccess<{ id: string }>, Record<string, unknown>>({
      query: (body) => ({ url: '/contact', method: 'POST', body }),
    }),
    submitNewsletter: build.mutation<ApiSuccess<{ subscribed: boolean }>, { email: string }>({
      query: (body) => ({ url: '/newsletter', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetStoreSettingsQuery,
  useGetBannersQuery,
  useGetDealsQuery,
  useGetDeliveryZonesQuery,
  useGetFaqsQuery,
  useGetBlogQuery,
  useGetBlogPostQuery,
  useGetReviewsQuery,
  useGetTeamQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useTrackOrderQuery,
  useLazyTrackOrderQuery,
  useLoginMutation,
  useGetAdminMetricsQuery,
  useSubmitPrescriptionMutation,
  useSubmitContactMutation,
  useSubmitNewsletterMutation,
} = storeApi;
