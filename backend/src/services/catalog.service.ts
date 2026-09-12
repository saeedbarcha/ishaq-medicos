import { Category } from '../models/category.model.js';
import { Brand } from '../models/brand.model.js';
import { Manufacturer } from '../models/manufacturer.model.js';
import { InventoryBatch } from '../models/inventoryBatch.model.js';
import { Product } from '../models/product.model.js';
import { createCrudService } from '../helpers/crud.helper.js';
import { leanDoc } from '../helpers/query.helper.js';
import { slugify, uniqueSlug } from '../helpers/slug.helper.js';
import { getByIdOrThrow } from '../helpers/document.helper.js';

export function toPublicCatalogItem(doc: unknown) {
  if (!doc || typeof doc !== 'object') return doc;
  const row = (
    'toJSON' in doc && typeof (doc as { toJSON?: () => unknown }).toJSON === 'function'
      ? (doc as { toJSON: () => Record<string, unknown> }).toJSON()
      : '_id' in doc
        ? leanDoc(doc as { _id?: unknown })
        : { ...(doc as object) }
  ) as Record<string, unknown>;
  const catalogId = typeof row.catalogId === 'string' && row.catalogId ? row.catalogId : undefined;
  const slug = typeof row.slug === 'string' ? row.slug : undefined;
  return { ...row, id: catalogId || slug || row.id };
}

const categories = createCrudService({ model: Category, resourceName: 'Category', uniqueField: 'slug' });
const brands = createCrudService({ model: Brand, resourceName: 'Brand', uniqueField: 'slug' });
const manufacturers = createCrudService({ model: Manufacturer, resourceName: 'Manufacturer', uniqueField: 'slug' });
const inventory = createCrudService({ model: InventoryBatch, resourceName: 'Inventory batch' });

export const categoryService = {
  ...categories,
  create: async (body: Record<string, unknown>) => {
    const name = String(body.name ?? '');
    const slug = String(body.slug || '') || (await uniqueSlug(name, async (s) => Boolean(await Category.exists({ slug: s }))));
    return Category.create({ ...body, name, slug: slugify(slug) });
  },
  getBySlug: (slug: string) =>
    Category.findOne({ $or: [{ slug }, { catalogId: slug }], active: { $ne: false } }),
};

export const brandService = {
  ...brands,
  create: async (body: Record<string, unknown>) => {
    const name = String(body.name ?? '');
    const slug = String(body.slug || '') || (await uniqueSlug(name, async (s) => Boolean(await Brand.exists({ slug: s }))));
    return Brand.create({ ...body, name, slug: slugify(slug) });
  },
  getBySlug: (slug: string) => Brand.findOne({ $or: [{ slug }, { catalogId: slug }] }),
};

export const manufacturerService = manufacturers;

export const inventoryService = {
  ...inventory,
  nearExpiry: async (days = 90) => {
    const until = new Date();
    until.setDate(until.getDate() + days);
    return InventoryBatch.find({ active: true, expiryDate: { $lte: until, $gte: new Date() } }).lean();
  },
  recountProductStock: async (productId: string) => {
    const batches = await InventoryBatch.find({ productId, active: true });
    const stock = batches.reduce((sum, batch) => sum + batch.quantity - batch.reservedQuantity, 0);
    const product = await Product.findById(productId);
    if (product) {
      product.stock = Math.max(0, stock);
      await product.save();
    }
    return stock;
  },
  getById: (id: string) => getByIdOrThrow(InventoryBatch, id, 'Inventory batch not found'),
};
