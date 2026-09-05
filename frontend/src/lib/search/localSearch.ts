import type { Product, ProductQuery, SearchSuggestion } from '@shared/types';
import { brands } from '@/data/brands';
import { categories } from '@/data/categories';
import { popularSearches } from '@/data/users';

const SYNONYMS: Record<string, string[]> = {
  paracetamol: ['panadol', 'calpol', 'acetaminophen'],
  panadol: ['paracetamol', 'acetaminophen'],
  bp: ['blood pressure', 'sphygmomanometer', 'bp apparatus', 'bp monitor'],
  glucometer: ['sugar machine', 'glucose', 'accu-chek', 'accuchek'],
  nebulizer: ['nebuliser', 'steam machine'],
  diaper: ['nappy', 'nappies', 'pampers'],
  sunscreen: ['sunblock', 'spf'],
  thermometer: ['temperature gun'],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+]+/g, ' ').trim();
}

function expandQuery(query: string) {
  const n = normalize(query);
  const extra = SYNONYMS[n] ?? [];
  const tokens = n.split(' ').filter(Boolean);
  for (const token of tokens) {
    extra.push(...(SYNONYMS[token] ?? []));
  }
  return [n, ...extra.map(normalize)];
}

function haystack(product: Product) {
  return normalize(
    [
      product.name,
      product.shortName,
      product.genericName,
      product.saltName,
      product.sku,
      product.barcode,
      product.packSize,
      product.strength,
      product.model,
      ...(product.tags ?? []),
      ...(product.searchKeywords ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

export function searchLocalProducts(products: Product[], query: string): Product[] {
  const q = query.trim();
  if (!q) return products;
  const variants = expandQuery(q);
  const exact = normalize(q);

  const scored = products
    .map((product) => {
      const text = haystack(product);
      let score = 0;
      if (normalize(product.name) === exact) score += 100;
      if (normalize(product.slug) === exact) score += 90;
      if (product.sku.toLowerCase() === q.toLowerCase()) score += 95;
      if (product.barcode === q) score += 95;
      if (normalize(product.genericName ?? '') === exact) score += 80;
      if (normalize(product.saltName ?? '') === exact) score += 80;
      for (const variant of variants) {
        if (!variant) continue;
        if (text.includes(variant)) score += variant === exact ? 40 : 12;
      }
      return { product, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((row) => row.product);
}

export function filterLocalProducts(products: Product[], query: ProductQuery): Product[] {
  return products.filter((product) => {
    if (!product.active) return false;
    if (query.category && product.categoryId !== query.category && product.subcategoryId !== query.category) {
      const cat = categories.find((c) => c.slug === query.category || c.id === query.category);
      if (!cat) return false;
      const match = product.categoryId === cat.id || product.subcategoryId === cat.id;
      if (!match) return false;
    }
    if (query.subcategory) {
      const sub = categories.find((c) => c.slug === query.subcategory || c.id === query.subcategory);
      if (!sub || product.subcategoryId !== sub.id) return false;
    }
    if (query.brand) {
      const brand = brands.find((b) => b.slug === query.brand || b.id === query.brand);
      if (!brand || product.brandId !== brand.id) return false;
    }
    if (query.kind && product.kind !== query.kind) return false;
    if (query.healthNeed && !(product.healthNeeds ?? []).includes(query.healthNeed)) return false;
    if (query.minPrice != null && (product.salePrice ?? product.price) < query.minPrice) return false;
    if (query.maxPrice != null && (product.salePrice ?? product.price) > query.maxPrice) return false;
    if (query.inStock && product.stock <= 0) return false;
    if (query.prescriptionRequired === true && !product.prescriptionRequired) return false;
    if (query.prescriptionRequired === false && product.prescriptionRequired) return false;
    if (query.featured && !product.featured) return false;
    return true;
  });
}

export function sortLocalProducts(products: Product[], sort: ProductQuery['sort'] = 'relevance'): Product[] {
  const copy = [...products];
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case 'price-desc':
      return copy.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    default:
      return copy;
  }
}

export function paginateLocal<T>(items: T[], page = 1, limit = 24) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: {
      page: current,
      limit,
      total,
      totalPages,
      hasNextPage: current < totalPages,
      hasPreviousPage: current > 1,
    },
  };
}

export function localSuggestions(query: string, products: Product[]): SearchSuggestion[] {
  const q = query.trim();
  if (!q) {
    return popularSearches.map((label) => ({
      type: 'popular' as const,
      id: label,
      label,
      href: `/search?q=${encodeURIComponent(label)}`,
    }));
  }
  const productHits = searchLocalProducts(products, q).slice(0, 5).map((product) => ({
    type: 'product' as const,
    id: product.id,
    label: product.name,
    href: `/products/${product.slug}`,
    meta: product.packSize,
  }));
  const n = q.toLowerCase();
  const categoryHits = categories
    .filter((c) => c.name.toLowerCase().includes(n) || c.slug.includes(n))
    .slice(0, 3)
    .map((c) => ({
      type: 'category' as const,
      id: c.id,
      label: c.name,
      href: `/${c.slug}`,
    }));
  const brandHits = brands
    .filter((b) => b.name.toLowerCase().includes(n) || b.slug.includes(n))
    .slice(0, 3)
    .map((b) => ({
      type: 'brand' as const,
      id: b.id,
      label: b.name,
      href: `/brands/${b.slug}`,
    }));
  return [...productHits, ...categoryHits, ...brandHits];
}
