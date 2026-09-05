import { Review } from '../models/review.model.js';
import { BlogPost } from '../models/blogPost.model.js';
import { Banner } from '../models/banner.model.js';
import { Deal } from '../models/deal.model.js';
import { Faq } from '../models/faq.model.js';
import { DeliveryZone } from '../models/deliveryZone.model.js';
import { StoreSettings } from '../models/storeSettings.model.js';
import { Inquiry, Newsletter, Coupon } from '../models/content.model.js';
import { createCrudService } from '../helpers/crud.helper.js';
import { slugify, uniqueSlug } from '../helpers/slug.helper.js';
import { defaultStoreSettings } from '../database/defaultStore.js';

export const reviewService = createCrudService({ model: Review, resourceName: 'Review' });

export const blogService = {
  ...createCrudService({ model: BlogPost, resourceName: 'Blog post', uniqueField: 'slug' }),
  create: async (body: Record<string, unknown>) => {
    const title = String(body.title ?? '');
    const slug = String(body.slug || '') || (await uniqueSlug(title, async (s) => Boolean(await BlogPost.exists({ slug: s }))));
    return BlogPost.create({ ...body, title, slug: slugify(slug) });
  },
  getBySlug: (slug: string) => BlogPost.findOne({ slug, published: { $ne: false } }),
};

export const bannerService = createCrudService({ model: Banner, resourceName: 'Banner' });
export const dealService = createCrudService({ model: Deal, resourceName: 'Deal' });
export const faqService = createCrudService({ model: Faq, resourceName: 'FAQ' });
export const deliveryZoneService = createCrudService({ model: DeliveryZone, resourceName: 'Delivery zone' });
export const couponService = createCrudService({ model: Coupon, resourceName: 'Coupon', uniqueField: 'code' });
export const inquiryService = createCrudService({ model: Inquiry, resourceName: 'Inquiry' });

export const newsletterService = {
  subscribe: async (email: string) => {
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      existing.active = true;
      await existing.save();
      return existing;
    }
    return Newsletter.create({ email: email.toLowerCase(), active: true });
  },
  query: createCrudService({ model: Newsletter, resourceName: 'Subscriber' }).query,
  deleteById: createCrudService({ model: Newsletter, resourceName: 'Subscriber' }).deleteById,
};

export const settingsService = {
  get: async () => {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(defaultStoreSettings);
    }
    return settings;
  },
  update: async (body: Record<string, unknown>) => {
    const settings = await settingsService.get();
    Object.assign(settings, body);
    await settings.save();
    return settings;
  },
};
