import type { Product, ProductQuery } from '@shared/types';
import { brands } from '@/data/brands';
import { categories } from '@/data/categories';
import { getProductBySlug, products } from '@/data/products';
import {
  filterLocalProducts,
  paginateLocal,
  searchLocalProducts,
  sortLocalProducts,
} from '@/lib/search/localSearch';

function applyQuery(query: ProductQuery = {}) {
  let list: Product[] = products.filter((item) => item.active);
  if (query.search) list = searchLocalProducts(list, query.search);
  list = filterLocalProducts(list, query);
  list = sortLocalProducts(list, query.sort);
  return list;
}

export const productRepository = {
  list(query: ProductQuery = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const list = applyQuery(query);
    const { data, meta } = paginateLocal(list, page, limit);
    return { items: data, meta };
  },
  allMatching(query: ProductQuery = {}) {
    return applyQuery(query);
  },
  getBySlug(slug: string) {
    return getProductBySlug(slug) ?? null;
  },
  getById(id: string) {
    return products.find((item) => item.id === id || item.slug === id || item.sku === id) ?? null;
  },
  featured(limit = 8) {
    return products.filter((item) => item.featured && item.active).slice(0, limit);
  },
  related(product: Product, limit = 4) {
    const byId = product.relatedProductIds
      .map((id) => products.find((item) => item.id === id))
      .filter(Boolean) as Product[];
    if (byId.length >= limit) return byId.slice(0, limit);
    const more = products.filter(
      (item) =>
        item.id !== product.id &&
        item.active &&
        (item.categoryId === product.categoryId || item.brandId === product.brandId),
    );
    const merged = [...byId];
    for (const item of more) {
      if (!merged.some((row) => row.id === item.id)) merged.push(item);
      if (merged.length >= limit) break;
    }
    return merged.slice(0, limit);
  },
};

export const categoryRepository = {
  list() {
    return categories.map((category) => ({
      ...category,
      productCount: products.filter(
        (item) => item.categoryId === category.id || item.subcategoryId === category.id,
      ).length,
    }));
  },
  getBySlug(slug: string) {
    return this.list().find((category) => category.slug === slug) ?? null;
  },
};

export const brandRepository = {
  list() {
    return brands;
  },
  getBySlug(slug: string) {
    return brands.find((brand) => brand.slug === slug) ?? null;
  },
};
