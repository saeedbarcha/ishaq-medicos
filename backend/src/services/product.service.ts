import mongoose from 'mongoose';
import { Product, type IProduct } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { Brand } from '../models/brand.model.js';
import { createCrudService } from '../helpers/crud.helper.js';
import { boolFromQuery, escapeRegex, leanDoc, numberFromQuery, textSearch } from '../helpers/query.helper.js';
import { slugify, uniqueSlug } from '../helpers/slug.helper.js';
import type { PaginateOptions } from '../models/plugins/paginate.plugin.js';

const base = createCrudService({ model: Product, resourceName: 'Product', uniqueField: 'sku' });

function asRecord(doc: unknown): Record<string, unknown> | null {
  if (!doc || typeof doc !== 'object') return null;
  if ('toJSON' in doc && typeof (doc as { toJSON?: () => unknown }).toJSON === 'function') {
    return (doc as { toJSON: () => Record<string, unknown> }).toJSON();
  }
  if ('_id' in doc) return leanDoc(doc as { _id?: unknown }) as Record<string, unknown>;
  return { ...(doc as object) };
}

export function toPublicProduct(doc: unknown) {
  const row = asRecord(doc);
  if (!row) return doc;
  const catalogId = typeof row.catalogId === 'string' && row.catalogId ? row.catalogId : undefined;
  const name = typeof row.name === 'string' ? row.name : 'Product';
  const seo = row.seo && typeof row.seo === 'object' ? (row.seo as Record<string, unknown>) : {};
  return {
    ...row,
    id: catalogId || row.id,
    images: Array.isArray(row.images) ? row.images : [],
    seo: {
      title: seo.title || name,
      description: seo.description || row.shortDescription || '',
      indexable: seo.indexable !== false,
      ...seo,
    },
  };
}

export async function createProduct(body: Partial<IProduct> & { name: string }) {
  const slug =
    body.slug ||
    (await uniqueSlug(body.name, async (s) => Boolean(await Product.exists({ slug: s }))));
  return Product.create({ ...body, slug: slugify(slug) });
}

export async function queryProducts(filter: Record<string, unknown>, options: PaginateOptions) {
  return Product.paginate(filter, options);
}

function catalogKeys(doc: { _id?: unknown; slug?: string; catalogId?: string } | null | undefined) {
  if (!doc) return [];
  return [String(doc._id ?? ''), doc.slug, doc.catalogId].filter(Boolean) as string[];
}

async function idsForCategory(value: string) {
  const ids = new Set<string>([value]);
  const root = await Category.findOne({
    $or: [
      { slug: value },
      { catalogId: value },
      { name: new RegExp(`^${escapeRegex(value)}$`, 'i') },
      ...(mongoose.isValidObjectId(value) ? [{ _id: value }] : []),
    ],
  }).lean();
  for (const key of catalogKeys(root as { _id?: unknown; slug?: string; catalogId?: string } | null)) ids.add(key);
  if (root) {
    const children = await Category.find({ parentId: { $in: [...ids] } }).lean();
    for (const child of children) {
      for (const key of catalogKeys(child as { _id?: unknown; slug?: string; catalogId?: string })) ids.add(key);
    }
  }
  return [...ids].filter(Boolean);
}

export async function buildProductFilter(query: Record<string, unknown>, { publicOnly = false } = {}) {
  const filter: Record<string, unknown> = {};
  if (publicOnly) filter.active = true;
  else if (query.active !== undefined) filter.active = boolFromQuery(query.active);

  const clauses: Record<string, unknown>[] = [];
  const search = String(query.search || query.q || '');
  const searchFilter = textSearch(['name', 'genericName', 'saltName', 'sku', 'shortDescription', 'searchKeywords'], search);
  if (Object.keys(searchFilter).length) clauses.push(searchFilter);

  if (query.category) {
    const ids = await idsForCategory(String(query.category));
    clauses.push({ $or: [{ categoryId: { $in: ids } }, { subcategoryId: { $in: ids } }] });
  }
  if (clauses.length === 1) Object.assign(filter, clauses[0]);
  else if (clauses.length > 1) filter.$and = clauses;
  if (query.subcategory) {
    const ids = await idsForCategory(String(query.subcategory));
    filter.subcategoryId = { $in: ids };
  }
  if (query.brand) {
    const value = String(query.brand);
    const brand = await Brand.findOne({
      $or: [{ slug: value }, { catalogId: value }, ...(mongoose.isValidObjectId(value) ? [{ _id: value }] : [])],
    }).lean();
    filter.brandId = { $in: [value, ...catalogKeys(brand as { _id?: unknown; slug?: string; catalogId?: string } | null)] };
  }
  if (query.kind) filter.kind = query.kind as string;
  if (query.healthNeed) filter.healthNeeds = query.healthNeed as string;
  if (query.featured !== undefined) {
    const featured = boolFromQuery(query.featured);
    if (featured !== undefined) filter.featured = featured;
  }
  const rx = boolFromQuery(query.prescriptionRequired);
  if (rx !== undefined) filter.prescriptionRequired = rx;
  const inStock = boolFromQuery(query.inStock);
  if (inStock === true) filter.stock = { $gt: 0 };
  if (inStock === false) filter.stock = { $lte: 0 };

  const minPrice = numberFromQuery(query.minPrice);
  const maxPrice = numberFromQuery(query.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined ? { $gte: minPrice } : {}),
      ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
    };
  }
  return filter;
}

export function productSort(sort?: string) {
  switch (sort) {
    case 'price-asc':
      return 'price:asc';
    case 'price-desc':
      return 'price:desc';
    case 'name-asc':
      return 'name:asc';
    case 'newest':
      return 'createdAt:desc';
    default:
      return 'featured:desc,createdAt:desc';
  }
}

export const getProductById = base.getById;

export async function getProductBySlug(slug: string, { publicOnly = false } = {}) {
  const active = publicOnly ? { active: true } : {};
  return Product.findOne({
    $or: [{ slug }, { catalogId: slug }, ...(mongoose.isValidObjectId(slug) ? [{ _id: slug }] : [])],
    ...active,
  });
}

export async function updateProductById(id: string, body: Partial<IProduct>) {
  if (body.slug) body.slug = slugify(body.slug);
  return base.updateById(id, body);
}

export const deleteProductById = base.deleteById;

export async function relatedProducts(product: IProduct & { id?: string; _id?: unknown }, limit = 4) {
  return Product.find({
    _id: { $ne: product._id ?? product.id },
    categoryId: product.categoryId,
    active: true,
  })
    .limit(limit)
    .select('-costPrice')
    .lean();
}

export default {
  createProduct,
  queryProducts,
  buildProductFilter,
  productSort,
  getProductById,
  getProductBySlug,
  updateProductById,
  deleteProductById,
  relatedProducts,
  toPublicProduct,
};
