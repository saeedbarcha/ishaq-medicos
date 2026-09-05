import httpStatus from 'http-status';
import { catchAsync } from '../../utils/index.js';
import { paginationMeta, sendCreated, sendSuccess } from '../../helpers/response.helper.js';
import ApiError from '../../utils/ApiError.js';
import productService from '../../services/product.service.js';
import { brandService, categoryService, toPublicCatalogItem } from '../../services/catalog.service.js';
import searchService from '../../services/search.service.js';
import {
  bannerService,
  blogService,
  dealService,
  deliveryZoneService,
  faqService,
  inquiryService,
  newsletterService,
  reviewService,
  settingsService,
} from '../../services/content.service.js';
import { orderService, prescriptionService } from '../../services/order.service.js';
import * as authService from '../../services/auth.service.js';
import userService from '../../services/user.service.js';
import { param } from '../../helpers/params.helper.js';

export const listProducts = catchAsync(async (req, res) => {
  const filter = await productService.buildProductFilter(req.query as Record<string, unknown>, { publicOnly: true });
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 24), 48);
  const result = await productService.queryProducts(filter, {
    page,
    limit,
    sortBy: productService.productSort(req.query.sort as string),
    select: '-costPrice',
  });
  sendSuccess(res, result.results.map((row) => productService.toPublicProduct(row)), 'Products retrieved successfully', httpStatus.OK, paginationMeta(result.page, result.limit, result.totalResults, result.totalPages));
});

export const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(param(req, 'slug'), { publicOnly: true });
  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  const related = await productService.relatedProducts(product);
  sendSuccess(
    res,
    {
      product: productService.toPublicProduct(product.toJSON()),
      related: related.map((row) => productService.toPublicProduct(row)),
    },
    'Product retrieved successfully',
  );
});

export const listCategories = catchAsync(async (_req, res) => {
  const result = await categoryService.query({ active: { $ne: false } }, { limit: 200, page: 1, sortBy: 'name:asc' });
  sendSuccess(res, result.results.map((row: unknown) => toPublicCatalogItem(row)), 'Categories retrieved successfully');
});

export const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getBySlug(param(req, 'slug'));
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  sendSuccess(res, toPublicCatalogItem(category), 'Category retrieved successfully');
});

export const listBrands = catchAsync(async (_req, res) => {
  const result = await brandService.query({}, { limit: 200, page: 1, sortBy: 'name:asc' });
  sendSuccess(res, result.results.map((row: unknown) => toPublicCatalogItem(row)), 'Brands retrieved successfully');
});

export const getBrand = catchAsync(async (req, res) => {
  const brand = await brandService.getBySlug(param(req, 'slug'));
  if (!brand) throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  sendSuccess(res, toPublicCatalogItem(brand), 'Brand retrieved successfully');
});

export const search = catchAsync(async (req, res) => {
  const { items, suggestions, meta } = await searchService.searchCatalog(req.query as Record<string, unknown>);
  sendSuccess(res, { items, suggestions }, 'Search completed', httpStatus.OK, paginationMeta(meta.page, meta.limit, meta.totalResults, meta.totalPages));
});

export const suggestions = catchAsync(async (req, res) => {
  const data = await searchService.suggestions(String(req.query.q || ''));
  sendSuccess(res, data, 'Suggestions retrieved');
});

export const getStore = catchAsync(async (_req, res) => {
  const settings = await settingsService.get();
  sendSuccess(res, settings, 'Store settings retrieved');
});

export const listBanners = catchAsync(async (_req, res) => {
  const result = await bannerService.query({ active: { $ne: false } }, { limit: 20, page: 1, sortBy: 'sortOrder:asc' });
  sendSuccess(res, result.results, 'Banners retrieved');
});

export const listDeals = catchAsync(async (_req, res) => {
  const result = await dealService.query({ active: { $ne: false } }, { limit: 20, page: 1, sortBy: 'createdAt:desc' });
  sendSuccess(res, result.results, 'Deals retrieved');
});

export const listZones = catchAsync(async (_req, res) => {
  const result = await deliveryZoneService.query({ active: { $ne: false } }, { limit: 50, page: 1, sortBy: 'name:asc' });
  sendSuccess(res, result.results, 'Delivery zones retrieved');
});

export const listFaqs = catchAsync(async (_req, res) => {
  const result = await faqService.query({ active: { $ne: false } }, { limit: 100, page: 1, sortBy: 'sortOrder:asc' });
  sendSuccess(res, result.results, 'FAQs retrieved');
});

export const listBlog = catchAsync(async (_req, res) => {
  const result = await blogService.query({ published: { $ne: false } }, { limit: 50, page: 1, sortBy: 'publishedAt:desc' });
  sendSuccess(res, result.results, 'Blog retrieved');
});

export const getBlog = catchAsync(async (req, res) => {
  const post = await blogService.getBySlug(param(req, 'slug'));
  if (!post) throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  sendSuccess(res, post, 'Article retrieved');
});

export const listReviews = catchAsync(async (req, res) => {
  const filter: Record<string, unknown> = { approved: { $ne: false } };
  if (req.query.productId) filter.productId = req.query.productId;
  const result = await reviewService.query(filter, { limit: 50, page: 1, sortBy: 'createdAt:desc' });
  sendSuccess(res, result.results, 'Reviews retrieved');
});

export const submitPrescription = catchAsync(async (req, res) => {
  const rx = await prescriptionService.submit(req.body);
  sendCreated(res, { id: String((rx as { id?: string }).id), status: String((rx as { status?: string }).status ?? 'received'), isDemo: false }, 'Prescription received');
});

export const submitContact = catchAsync(async (req, res) => {
  const inquiry = await inquiryService.create(req.body);
  sendCreated(res, { id: inquiry.id }, 'Enquiry received');
});

export const submitNewsletter = catchAsync(async (req, res) => {
  await newsletterService.subscribe(req.body.email);
  sendCreated(res, { subscribed: true }, 'Subscribed');
});

export const listMyOrders = catchAsync(async (req, res) => {
  if (!req.user?.id) {
    sendSuccess(res, [], 'Orders retrieved');
    return;
  }
  const orders = await orderService.listForUser(req.user.id);
  sendSuccess(res, orders, 'Orders retrieved');
});

export const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createFromCheckout({ ...req.body, userId: req.user?.id });
  sendCreated(res, order, 'Order placed');
});

export const trackOrder = catchAsync(async (req, res) => {
  const order = await orderService.getByPublicRef(String(req.query.ref), req.query.token as string | undefined);
  sendSuccess(res, order, 'Order retrieved');
});

export const register = catchAsync(async (req, res) => {
  const result = await authService.registerCustomer(req.body);
  sendCreated(res, result, 'Account created');
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  sendSuccess(res, result, 'Logged in');
});

export const refreshTokens = catchAsync(async (req, res) => {
  const result = await authService.refreshAuth(req.body.refreshToken);
  sendSuccess(res, result, 'Tokens refreshed');
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  sendSuccess(res, { loggedOut: true }, 'Logged out');
});

export const listTeam = catchAsync(async (_req, res) => {
  const members = await userService.listPublicTeam();
  sendSuccess(res, members, 'Team retrieved');
});
