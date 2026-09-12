import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { localSuggestions } from '@/lib/search/localSearch';
import { products } from '@/data/products';
import { inventoryBatches } from '@/data/users';
import { brandRepository, categoryRepository, productRepository } from '@/repositories/productRepository';
import { blogRepository, demoAccountRepository, reviewRepository, storeRepository } from '@/repositories/storeRepository';
import { demoUsers } from '@/data/users';
import {
  allAdminUsers,
  createLocalStaff,
  deleteLocalStaff,
  publicTeam,
  updateLocalStaff,
} from '@/repositories/staffRepository';
import type { ProductQuery } from '@shared/types';

interface LocalResult {
  data: unknown;
  error?: undefined;
}

function ok(data: unknown): LocalResult {
  return { data };
}

function notFound(message: string): { error: FetchBaseQueryError } {
  return {
    error: { status: 404, data: { success: false, message } },
  };
}

function pathOf(args: string | FetchArgs) {
  if (typeof args === 'string') return args;
  return args.url;
}

function methodOf(args: string | FetchArgs) {
  if (typeof args === 'string') return 'GET';
  return (args.method ?? 'GET').toUpperCase();
}

function parseUrl(raw: string) {
  const url = new URL(raw, 'http://local.catalog');
  const path = url.pathname.replace(/\/$/, '') || '/';
  const params = Object.fromEntries(url.searchParams.entries());
  return { path, params, url };
}

function productQueryFrom(params: Record<string, string>): ProductQuery {
  return {
    search: params.search || params.q,
    category: params.category,
    subcategory: params.subcategory,
    brand: params.brand,
    kind: params.kind as ProductQuery['kind'],
    healthNeed: params.healthNeed,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStock: params.inStock === 'true' ? true : params.inStock === 'false' ? false : undefined,
    prescriptionRequired:
      params.prescriptionRequired === 'true'
        ? true
        : params.prescriptionRequired === 'false'
          ? false
          : undefined,
    featured: params.featured === 'true' ? true : undefined,
    sort: (params.sort as ProductQuery['sort']) ?? 'relevance',
    page: params.page ? Number(params.page) : 1,
    limit: params.limit ? Number(params.limit) : 24,
  };
}

export function fulfillLocal(args: string | FetchArgs): LocalResult | { error: FetchBaseQueryError } {
  const method = methodOf(args);
  const { path, params } = parseUrl(pathOf(args));
  const body = typeof args === 'object' ? args.body : undefined;

  if (path.includes('/admin') || path.startsWith('admin')) {
    const list = (data: unknown, message: string) => ok({ success: true, message, data, meta: { page: 1, limit: Array.isArray(data) ? data.length : 0, total: Array.isArray(data) ? data.length : 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false } });
    if (method === 'GET' && path.includes('dashboard')) {
      return ok({ success: true, message: 'Metrics retrieved', data: demoAccountRepository.metrics() });
    }
    if (method === 'GET' && path.includes('metrics')) {
      return ok({ success: true, message: 'Metrics retrieved', data: demoAccountRepository.metrics() });
    }
    if (method === 'GET' && path.includes('products')) return list(products, 'Products retrieved');
    if (method === 'GET' && path.includes('categories')) return list(categoryRepository.list(), 'Categories retrieved');
    if (method === 'GET' && path.includes('brands')) return list(brandRepository.list(), 'Brands retrieved');
    if (method === 'GET' && path.includes('orders')) return list(demoAccountRepository.orders(), 'Orders retrieved');
    if (method === 'GET' && path.includes('prescriptions')) return list(demoAccountRepository.prescriptions(), 'Prescriptions retrieved');
    if (method === 'GET' && path.includes('inventory')) return list(inventoryBatches, 'Inventory retrieved');
    if (method === 'GET' && path.includes('banners')) return list(storeRepository.banners(), 'Banners retrieved');
    if (method === 'GET' && path.includes('blog')) return list(blogRepository.list(), 'Blog retrieved');
    if (method === 'GET' && path.includes('faqs')) return list(storeRepository.faqs(), 'FAQs retrieved');
    if (method === 'GET' && path.includes('delivery-zones')) return list(storeRepository.deliveryZones(), 'Delivery zones retrieved');
    if (method === 'GET' && path.includes('reviews')) return list(reviewRepository.list(), 'Reviews retrieved');
    if (method === 'GET' && path.includes('inquiries')) return list([], 'Inquiries retrieved');
    if (method === 'GET' && path.includes('settings')) return ok({ success: true, message: 'Store settings retrieved', data: storeRepository.settings() });
    if (path.includes('users')) {
      const idMatch = path.match(/users\/([^/?]+)$/);
      const userId = idMatch ? decodeURIComponent(idMatch[1]) : null;
      if (method === 'GET' && !userId) return list(allAdminUsers(), 'Users retrieved');
      if (method === 'POST') {
        try {
          const row = createLocalStaff((body as Record<string, unknown>) ?? {});
          return ok({ success: true, message: 'Staff saved in this browser until you use the live API.', data: row });
        } catch (error) {
          return { error: { status: 400, data: { success: false, message: error instanceof Error ? error.message : 'Could not save staff' } } };
        }
      }
      if (userId && method === 'PATCH') {
        const row = updateLocalStaff(userId, (body as Record<string, unknown>) ?? {});
        if (!row) return notFound('User not found');
        return ok({ success: true, message: 'Staff updated', data: row });
      }
      if (userId && method === 'DELETE') {
        try {
          return ok({ success: true, message: 'Staff removed', data: deleteLocalStaff(userId) });
        } catch (error) {
          return { error: { status: 400, data: { success: false, message: error instanceof Error ? error.message : 'Could not delete' } } };
        }
      }
    }
    if (method === 'GET' && path.includes('audit-logs')) return list([], 'Audit logs retrieved');
    if (method === 'POST' && path.includes('login')) {
      return ok({
        success: true,
        message: 'Demo admin session',
        data: {
          user: demoUsers[1],
          tokens: { access: { token: 'demo-admin' }, refresh: { token: 'demo-admin' } },
          isDemo: true,
        },
      });
    }
    if (method !== 'GET') {
      return ok({
        success: true,
        message: 'Demo mode: changes are not saved. Sign in against the API to persist content.',
        data: { id: `demo-${Date.now()}`, isDemo: true, ...(typeof body === 'object' && body ? body : {}) },
      });
    }
  }

  if (method === 'GET' && (path === '/products' || path === 'products')) {
    const result = productRepository.list(productQueryFrom(params));
    return ok({ success: true, message: 'Products retrieved successfully', data: result.items, meta: result.meta });
  }

  const productMatch = path.match(/\/?products\/([^/]+)$/);
  if (method === 'GET' && productMatch) {
    const key = decodeURIComponent(productMatch[1]);
    const product = productRepository.getBySlug(key) ?? productRepository.getById(key);
    if (!product) return notFound('Product not found');
    return ok({
      success: true,
      message: 'Product retrieved successfully',
      data: { product, related: productRepository.related(product) },
    });
  }

  if (method === 'GET' && (path === '/categories' || path === 'categories')) {
    return ok({ success: true, message: 'Categories retrieved successfully', data: categoryRepository.list() });
  }

  const categoryMatch = path.match(/\/?categories\/([^/]+)$/);
  if (method === 'GET' && categoryMatch) {
    const category = categoryRepository.getBySlug(decodeURIComponent(categoryMatch[1]));
    if (!category) return notFound('Category not found');
    return ok({ success: true, message: 'Category retrieved successfully', data: category });
  }

  if (method === 'GET' && (path === '/brands' || path === 'brands')) {
    return ok({ success: true, message: 'Brands retrieved successfully', data: brandRepository.list() });
  }

  const brandMatch = path.match(/\/?brands\/([^/]+)$/);
  if (method === 'GET' && brandMatch) {
    const brand = brandRepository.getBySlug(decodeURIComponent(brandMatch[1]));
    if (!brand) return notFound('Brand not found');
    return ok({ success: true, message: 'Brand retrieved successfully', data: brand });
  }

  if (method === 'GET' && (path === '/search' || path === 'search')) {
    const q = params.q ?? params.search ?? '';
    const result = productRepository.list({ ...productQueryFrom(params), search: q });
    return ok({
      success: true,
      message: 'Search completed',
      data: { items: result.items, suggestions: localSuggestions(q, products) },
      meta: result.meta,
    });
  }

  if (method === 'GET' && path.includes('suggestions')) {
    return ok({
      success: true,
      message: 'Suggestions retrieved',
      data: localSuggestions(params.q ?? '', products),
    });
  }

  if (method === 'GET' && path.includes('store')) {
    return ok({ success: true, message: 'Store settings retrieved', data: storeRepository.settings() });
  }

  if (method === 'GET' && path.includes('banners')) {
    return ok({ success: true, message: 'Banners retrieved', data: storeRepository.banners() });
  }

  if (method === 'GET' && path.includes('deals')) {
    return ok({ success: true, message: 'Deals retrieved', data: storeRepository.deals() });
  }

  if (method === 'GET' && path.includes('delivery')) {
    return ok({ success: true, message: 'Delivery zones retrieved', data: storeRepository.deliveryZones() });
  }

  if (method === 'GET' && path.includes('faqs')) {
    return ok({ success: true, message: 'FAQs retrieved', data: storeRepository.faqs() });
  }

  if (method === 'GET' && (path === '/blog' || path === 'blog' || path.endsWith('/blog'))) {
    return ok({ success: true, message: 'Blog retrieved', data: blogRepository.list() });
  }

  const blogMatch = path.match(/\/?blog\/([^/]+)$/);
  if (method === 'GET' && blogMatch) {
    const post = blogRepository.getBySlug(decodeURIComponent(blogMatch[1]));
    if (!post) return notFound('Article not found');
    return ok({ success: true, message: 'Article retrieved', data: post });
  }

  if (method === 'GET' && (path === '/team' || path === 'team' || path.endsWith('/team'))) {
    return ok({ success: true, message: 'Team retrieved', data: publicTeam() });
  }

  if (method === 'GET' && path.includes('reviews')) {
    return ok({ success: true, message: 'Reviews retrieved', data: reviewRepository.list(params.productId) });
  }

  if (method === 'GET' && path.includes('admin/metrics')) {
    return ok({ success: true, message: 'Metrics retrieved', data: demoAccountRepository.metrics() });
  }

  if (method === 'GET' && path.includes('orders/track')) {
    const order = demoAccountRepository.orders().find((row) => row.publicRef === params.ref) ?? demoAccountRepository.orders()[0];
    if (!order) return notFound('Order not found');
    return ok({ success: true, message: 'Order retrieved', data: order });
  }

  if (method === 'GET' && path.includes('orders')) {
    return ok({ success: true, message: 'Orders retrieved', data: demoAccountRepository.orders() });
  }

  if (method === 'POST' && path.includes('prescriptions')) {
    return ok({
      success: true,
      message: 'Demo prescription accepted locally. The file was not uploaded.',
      data: {
        id: `rx-demo-${Date.now()}`,
        status: 'received',
        isDemo: true,
        createdAt: new Date().toISOString(),
      },
    });
  }

  if (method === 'POST' && path.includes('contact')) {
    return ok({
      success: true,
      message: 'Demo enquiry recorded in this browser session only.',
      data: { id: `inq-${Date.now()}`, isDemo: true },
    });
  }

  if (method === 'POST' && path.includes('orders')) {
    return ok({
      success: true,
      message: 'Demo order recorded in this browser session only.',
      data: {
        id: `ord-demo-${Date.now()}`,
        publicRef: `IM-DEMO-${Date.now().toString().slice(-6)}`,
        accessToken: 'demo-track-7f3a',
        status: 'pending',
        total: 0,
        isDemo: true,
      },
    });
  }

  if (method === 'POST' && path.includes('auth/login')) {
    return ok({
      success: true,
      message: 'Demo session only',
      data: {
        user: demoUsers[0],
        tokens: { access: { token: 'demo' }, refresh: { token: 'demo' } },
        isDemo: true,
      },
    });
  }

  if (method === 'POST' && path.includes('newsletter')) {
    return ok({ success: true, message: 'Demo subscription stored locally only.', data: { subscribed: true, isDemo: true } });
  }

  void body;
  return notFound(`No local adapter for ${method} ${path}`);
}
