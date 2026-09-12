import Joi from 'joi';
import { objectId } from './custom.validation.js';

const seo = Joi.object({
  title: Joi.string().allow(''),
  description: Joi.string().allow(''),
  canonicalUrl: Joi.string().allow(''),
  ogImage: Joi.string().allow(''),
  indexable: Joi.boolean(),
});

export const productQuery = {
  query: Joi.object().keys({
    search: Joi.string().allow(''),
    q: Joi.string().allow(''),
    category: Joi.string(),
    subcategory: Joi.string(),
    brand: Joi.string(),
    kind: Joi.string(),
    healthNeed: Joi.string(),
    minPrice: Joi.number(),
    maxPrice: Joi.number(),
    inStock: Joi.alternatives().try(Joi.boolean(), Joi.string()),
    prescriptionRequired: Joi.alternatives().try(Joi.boolean(), Joi.string()),
    featured: Joi.alternatives().try(Joi.boolean(), Joi.string()),
    active: Joi.alternatives().try(Joi.boolean(), Joi.string()),
    sort: Joi.string(),
    sortBy: Joi.string(),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const productBody = {
  name: Joi.string(),
  slug: Joi.string(),
  shortName: Joi.string().allow(''),
  shortDescription: Joi.string().allow(''),
  description: Joi.string().allow(''),
  kind: Joi.string().valid('medicine', 'surgical', 'cosmetic', 'personal-care', 'mother-baby', 'supplement'),
  brandId: Joi.string().allow(''),
  manufacturerId: Joi.string().allow(''),
  categoryId: Joi.string(),
  subcategoryId: Joi.string().allow(''),
  genericName: Joi.string().allow(''),
  saltName: Joi.string().allow(''),
  strength: Joi.string().allow(''),
  dosageForm: Joi.string().allow(''),
  packSize: Joi.string().allow(''),
  sku: Joi.string(),
  barcode: Joi.string().allow(''),
  images: Joi.array().items(Joi.object({ url: Joi.string(), alt: Joi.string().allow('') })),
  price: Joi.number().min(0),
  salePrice: Joi.number().min(0).allow(null),
  costPrice: Joi.number().min(0).allow(null),
  stock: Joi.number().min(0),
  lowStockThreshold: Joi.number().min(0),
  prescriptionRequired: Joi.boolean(),
  controlledMedicine: Joi.boolean(),
  requiresPharmacistApproval: Joi.boolean(),
  featured: Joi.boolean(),
  bestSeller: Joi.boolean(),
  newArrival: Joi.boolean(),
  active: Joi.boolean(),
  tags: Joi.array().items(Joi.string()),
  searchKeywords: Joi.array().items(Joi.string()),
  healthNeeds: Joi.array().items(Joi.string()),
  attributes: Joi.object(),
  storage: Joi.string().allow(''),
  warnings: Joi.array().items(Joi.string()),
  seo,
  relatedProductIds: Joi.array().items(Joi.string()),
  ingredients: Joi.string().allow(''),
  directions: Joi.string().allow(''),
  countryOfOrigin: Joi.string().allow(''),
};

export const createProduct = {
  body: Joi.object().keys({ ...productBody, name: Joi.string().required(), sku: Joi.string().required(), categoryId: Joi.string().required(), kind: productBody.kind.required(), price: Joi.number().min(0).required() }),
};

export const updateProduct = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object().keys(productBody).min(1),
};

export const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string(),
    parentId: Joi.string().allow(null, ''),
    description: Joi.string().allow(''),
    intro: Joi.string().allow(''),
    seoContent: Joi.string().allow(''),
    icon: Joi.string().allow(''),
    image: Joi.string().allow(''),
    featured: Joi.boolean(),
    navGroup: Joi.string().valid('medicines', 'surgical', 'cosmetics', 'personal', 'mother', 'vitamins'),
    seo,
    relatedCategoryIds: Joi.array().items(Joi.string()),
    relatedBlogSlugs: Joi.array().items(Joi.string()),
    faqs: Joi.array().items(Joi.object({ question: Joi.string(), answer: Joi.string() })),
    active: Joi.boolean(),
  }),
};

export const updateCategory = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: createCategory.body.fork(Object.keys(createCategory.body.describe().keys), (s) => s.optional()).min(1),
};

export const createBrand = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string(),
    description: Joi.string().allow(''),
    origin: Joi.string().allow(''),
    featured: Joi.boolean(),
    logoText: Joi.string().allow(''),
    seo,
    active: Joi.boolean(),
  }),
};

export const updateBrand = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      slug: Joi.string(),
      description: Joi.string().allow(''),
      origin: Joi.string().allow(''),
      featured: Joi.boolean(),
      logoText: Joi.string().allow(''),
      seo,
      active: Joi.boolean(),
    })
    .min(1),
};

export const createManufacturer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string(),
    country: Joi.string().allow(''),
    active: Joi.boolean(),
  }),
};

export const updateManufacturer = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object().keys({ name: Joi.string(), slug: Joi.string(), country: Joi.string().allow(''), active: Joi.boolean() }).min(1),
};

export const createInventory = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    batchNumber: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
    reservedQuantity: Joi.number().min(0),
    expiryDate: Joi.date().required(),
    purchaseDate: Joi.date(),
    supplierReference: Joi.string().allow(''),
    notes: Joi.string().allow(''),
    active: Joi.boolean(),
  }),
};

export const updateInventory = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      productId: Joi.string(),
      batchNumber: Joi.string(),
      quantity: Joi.number().min(0),
      reservedQuantity: Joi.number().min(0),
      expiryDate: Joi.date(),
      purchaseDate: Joi.date(),
      supplierReference: Joi.string().allow(''),
      notes: Joi.string().allow(''),
      active: Joi.boolean(),
    })
    .min(1),
};

export const productValidation = {
  productQuery,
  createProduct,
  updateProduct,
  createCategory,
  updateCategory,
  createBrand,
  updateBrand,
  createManufacturer,
  updateManufacturer,
  createInventory,
  updateInventory,
};
