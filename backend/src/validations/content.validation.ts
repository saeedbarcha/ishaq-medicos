import Joi from 'joi';
import { objectId } from './custom.validation.js';

const seo = Joi.object({
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  canonicalUrl: Joi.string().allow(''),
  ogImage: Joi.string().allow(''),
  indexable: Joi.boolean(),
});

export const createBanner = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    subtitle: Joi.string().allow(''),
    ctaLabel: Joi.string().allow(''),
    ctaHref: Joi.string().allow(''),
    tone: Joi.string().valid('teal', 'navy', 'mint', 'sand'),
    imageLabel: Joi.string().allow(''),
    imageUrl: Joi.string().allow(''),
    active: Joi.boolean(),
    sortOrder: Joi.number(),
  }),
};

export const updateBanner = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      subtitle: Joi.string().allow(''),
      ctaLabel: Joi.string().allow(''),
      ctaHref: Joi.string().allow(''),
      tone: Joi.string().valid('teal', 'navy', 'mint', 'sand'),
      imageLabel: Joi.string().allow(''),
      imageUrl: Joi.string().allow(''),
      active: Joi.boolean(),
      sortOrder: Joi.number(),
    })
    .min(1),
};

export const createDeal = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    productIds: Joi.array().items(Joi.string()),
    badge: Joi.string().allow(''),
    endsAt: Joi.date().allow(null),
    active: Joi.boolean(),
  }),
};

export const updateDeal = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string().allow(''),
      productIds: Joi.array().items(Joi.string()),
      badge: Joi.string().allow(''),
      endsAt: Joi.date().allow(null),
      active: Joi.boolean(),
    })
    .min(1),
};

export const createFaq = {
  body: Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    group: Joi.string().valid('ordering', 'prescription', 'delivery', 'products'),
    sortOrder: Joi.number(),
    active: Joi.boolean(),
  }),
};

export const updateFaq = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      question: Joi.string(),
      answer: Joi.string(),
      group: Joi.string().valid('ordering', 'prescription', 'delivery', 'products'),
      sortOrder: Joi.number(),
      active: Joi.boolean(),
    })
    .min(1),
};

export const createBlog = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    slug: Joi.string(),
    excerpt: Joi.string().allow(''),
    content: Joi.string().allow(''),
    category: Joi.string().allow(''),
    tags: Joi.array().items(Joi.string()),
    relatedCategorySlugs: Joi.array().items(Joi.string()),
    relatedProductSlugs: Joi.array().items(Joi.string()),
    readMinutes: Joi.number(),
    publishedAt: Joi.date(),
    reviewed: Joi.boolean(),
    published: Joi.boolean(),
    seo,
  }),
};

export const updateBlog = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      slug: Joi.string(),
      excerpt: Joi.string().allow(''),
      content: Joi.string().allow(''),
      category: Joi.string().allow(''),
      tags: Joi.array().items(Joi.string()),
      relatedCategorySlugs: Joi.array().items(Joi.string()),
      relatedProductSlugs: Joi.array().items(Joi.string()),
      readMinutes: Joi.number(),
      publishedAt: Joi.date(),
      reviewed: Joi.boolean(),
      published: Joi.boolean(),
      seo,
    })
    .min(1),
};

export const createZone = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    district: Joi.string().required(),
    areas: Joi.array().items(Joi.string()),
    estimatedDays: Joi.string().allow(''),
    notes: Joi.string().allow(''),
    active: Joi.boolean(),
  }),
};

export const updateZone = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      district: Joi.string(),
      areas: Joi.array().items(Joi.string()),
      estimatedDays: Joi.string().allow(''),
      notes: Joi.string().allow(''),
      active: Joi.boolean(),
    })
    .min(1),
};

export const createReview = {
  body: Joi.object().keys({
    productId: Joi.string().allow(''),
    authorDisplay: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().allow(''),
    body: Joi.string().allow(''),
    approved: Joi.boolean(),
  }),
};

export const updateReview = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      productId: Joi.string().allow(''),
      authorDisplay: Joi.string(),
      rating: Joi.number().min(1).max(5),
      title: Joi.string().allow(''),
      body: Joi.string().allow(''),
      approved: Joi.boolean(),
    })
    .min(1),
};

export const createCoupon = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    description: Joi.string().allow(''),
    percentOff: Joi.number().min(0).max(100),
    amountOff: Joi.number().min(0),
    minOrder: Joi.number().min(0),
    active: Joi.boolean(),
    startsAt: Joi.date(),
    endsAt: Joi.date(),
    usageLimit: Joi.number().min(0),
  }),
};

export const updateCoupon = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      code: Joi.string(),
      description: Joi.string().allow(''),
      percentOff: Joi.number().min(0).max(100),
      amountOff: Joi.number().min(0),
      minOrder: Joi.number().min(0),
      active: Joi.boolean(),
      startsAt: Joi.date(),
      endsAt: Joi.date(),
      usageLimit: Joi.number().min(0),
    })
    .min(1),
};

export const updateSettings = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      shortName: Joi.string(),
      legalName: Joi.string(),
      tagline: Joi.string().allow(''),
      description: Joi.string().allow(''),
      region: Joi.string().allow(''),
      address: Joi.string().allow(''),
      city: Joi.string().allow(''),
      district: Joi.string().allow(''),
      phone: Joi.string().allow(''),
      whatsapp: Joi.string().allow(''),
      email: Joi.string().allow(''),
      openingHours: Joi.string().allow(''),
      mapEmbedUrl: Joi.string().allow(''),
      latitude: Joi.number(),
      longitude: Joi.number(),
      foundingYear: Joi.string().allow(''),
      licenseNumber: Joi.string().allow(''),
      pharmacistName: Joi.string().allow(''),
      social: Joi.object(),
      announcement: Joi.string().allow(''),
      currency: Joi.string(),
      currencySymbol: Joi.string(),
      placeholders: Joi.object(),
      seo,
    })
    .min(1),
};

export const contentValidation = {
  createBanner,
  updateBanner,
  createDeal,
  updateDeal,
  createFaq,
  updateFaq,
  createBlog,
  updateBlog,
  createZone,
  updateZone,
  createReview,
  updateReview,
  createCoupon,
  updateCoupon,
  updateSettings,
};
