import { blogPosts, getPostBySlug } from '@/data/blogPosts';
import { banners, deals } from '@/data/banners';
import { deliveryZones, faqs } from '@/data/deliveryZones';
import { reviews } from '@/data/reviews';
import { storeSettings } from '@/data/storeSettings';
import { adminMetrics, demoOrders, demoPrescriptions, demoUsers } from '@/data/users';

export const storeRepository = {
  settings: () => storeSettings,
  banners: () => banners,
  deals: () => deals,
  deliveryZones: () => deliveryZones,
  faqs: () => faqs,
};

export const blogRepository = {
  list: () => blogPosts,
  getBySlug: (slug: string) => getPostBySlug(slug) ?? null,
};

export const reviewRepository = {
  list: (productId?: string) =>
    productId ? reviews.filter((review) => review.productId === productId) : reviews,
};

export const demoAccountRepository = {
  user: () => demoUsers[0],
  orders: () => demoOrders,
  prescriptions: () => demoPrescriptions,
  metrics: () => adminMetrics,
};
