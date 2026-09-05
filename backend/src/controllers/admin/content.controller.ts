import { createAdminCrudController } from '../../helpers/crudController.helper.js';
import { catchAsync } from '../../utils/index.js';
import { sendSuccess } from '../../helpers/response.helper.js';
import { recordAudit } from '../../helpers/audit.helper.js';
import {
  bannerService,
  blogService,
  couponService,
  dealService,
  deliveryZoneService,
  faqService,
  reviewService,
  settingsService,
} from '../../services/content.service.js';

export const banners = createAdminCrudController(bannerService, 'Banner', ['active', 'tone']);
export const deals = createAdminCrudController(dealService, 'Deal', ['active']);
export const faqs = createAdminCrudController(faqService, 'FAQ', ['group', 'active']);
export const blog = createAdminCrudController(blogService, 'Blog post', ['published', 'category', 'reviewed']);
export const zones = createAdminCrudController(deliveryZoneService, 'Delivery zone', ['district', 'active']);
export const reviews = createAdminCrudController(reviewService, 'Review', ['productId', 'approved']);
export const coupons = createAdminCrudController(couponService, 'Coupon', ['active', 'code']);

export const getSettings = catchAsync(async (_req, res) => {
  const settings = await settingsService.get();
  sendSuccess(res, settings, 'Store settings retrieved');
});

export const updateSettings = catchAsync(async (req, res) => {
  const settings = await settingsService.update(req.body);
  await recordAudit(req, 'update', 'settings');
  sendSuccess(res, settings, 'Store settings updated');
});
