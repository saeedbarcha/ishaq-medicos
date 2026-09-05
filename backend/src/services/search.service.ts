import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { Brand } from '../models/brand.model.js';
import { escapeRegex } from '../helpers/query.helper.js';
import productService from './product.service.js';

export async function searchCatalog(query: Record<string, unknown>) {
  const filter = await productService.buildProductFilter(query, { publicOnly: true });
  const page = Number(query.page || 1);
  const limit = Math.min(Number(query.limit || 24), 48);
  const result = await productService.queryProducts(filter, {
    page,
    limit,
    sortBy: productService.productSort(String(query.sort || '')),
    select: '-costPrice',
  });
  const q = String(query.q || query.search || '');
  return {
    items: result.results.map((row) => productService.toPublicProduct(row)),
    suggestions: q ? await suggestions(q) : [],
    meta: result,
  };
}

export async function suggestions(q: string) {
  if (!q.trim()) return [];
  const rx = new RegExp(escapeRegex(q.trim()), 'i');
  const [products, categories, brands] = await Promise.all([
    Product.find({ active: true, $or: [{ name: rx }, { genericName: rx }, { sku: rx }] })
      .limit(5)
      .select('name slug genericName')
      .lean(),
    Category.find({ active: { $ne: false }, name: rx }).limit(3).select('name slug').lean(),
    Brand.find({ name: rx }).limit(3).select('name slug').lean(),
  ]);

  return [
    ...products.map((p) => ({
      type: 'product' as const,
      id: String((p as { catalogId?: string }).catalogId || p._id),
      label: p.name,
      href: `/products/${p.slug}`,
      meta: p.genericName,
    })),
    ...categories.map((c) => ({
      type: 'category' as const,
      id: String((c as { catalogId?: string }).catalogId || c.slug || c._id),
      label: c.name,
      href: `/${c.slug}`,
    })),
    ...brands.map((b) => ({
      type: 'brand' as const,
      id: String((b as { catalogId?: string }).catalogId || b.slug || b._id),
      label: b.name,
      href: `/brands/${b.slug}`,
    })),
  ];
}

export default { searchCatalog, suggestions };
