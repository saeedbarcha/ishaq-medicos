import type { Product, ProductKind } from '@shared/types';
import { products } from '@/data/products';
import { photoForKind, seedFrom } from '@/data/storeImages';

const kinds: ProductKind[] = ['medicine', 'surgical', 'cosmetic', 'personal-care', 'mother-baby', 'supplement'];

function asKind(value: unknown): ProductKind {
  return kinds.includes(value as ProductKind) ? (value as ProductKind) : 'medicine';
}

export function findLocalProduct(key?: string) {
  if (!key) return undefined;
  return products.find((item) => item.id === key || item.slug === key || item.sku === key);
}

export function hydrateProduct(raw: Partial<Product> | null | undefined): Product | null {
  if (!raw || typeof raw !== 'object') return null;
  const local = findLocalProduct(raw.slug) ?? findLocalProduct(raw.id) ?? findLocalProduct(raw.sku);
  const name = raw.name || local?.name;
  const slug = raw.slug || local?.slug;
  if (!name || !slug) return local ?? null;

  const kind = asKind(raw.kind ?? local?.kind);
  const images = Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : local?.images;
  const seo = raw.seo?.title ? raw.seo : local?.seo;

  return {
    ...(local ?? {}),
    ...raw,
    id: raw.id || local?.id || slug,
    name,
    slug,
    kind,
    shortDescription: raw.shortDescription || local?.shortDescription || name,
    description: raw.description || local?.description || raw.shortDescription || name,
    brandId: raw.brandId || local?.brandId || '',
    manufacturerId: raw.manufacturerId || local?.manufacturerId || '',
    categoryId: raw.categoryId || local?.categoryId || '',
    packSize: raw.packSize || local?.packSize || '',
    sku: raw.sku || local?.sku || slug,
    price: Number(raw.price ?? local?.price ?? 0),
    salePrice: raw.salePrice ?? local?.salePrice,
    stock: Number(raw.stock ?? local?.stock ?? 0),
    lowStockThreshold: Number(raw.lowStockThreshold ?? local?.lowStockThreshold ?? 5),
    prescriptionRequired: Boolean(raw.prescriptionRequired ?? local?.prescriptionRequired),
    controlledMedicine: Boolean(raw.controlledMedicine ?? local?.controlledMedicine),
    requiresPharmacistApproval: Boolean(raw.requiresPharmacistApproval ?? local?.requiresPharmacistApproval),
    featured: Boolean(raw.featured ?? local?.featured),
    bestSeller: Boolean(raw.bestSeller ?? local?.bestSeller),
    newArrival: Boolean(raw.newArrival ?? local?.newArrival),
    active: raw.active !== false,
    images: images?.length ? images : [{ url: photoForKind(kind, seedFrom(slug)), alt: name }],
    tags: raw.tags ?? local?.tags ?? [],
    searchKeywords: raw.searchKeywords ?? local?.searchKeywords ?? [],
    healthNeeds: raw.healthNeeds ?? local?.healthNeeds ?? [],
    relatedProductIds: raw.relatedProductIds ?? local?.relatedProductIds ?? [],
    attributes: raw.attributes ?? local?.attributes ?? {},
    warnings: raw.warnings ?? local?.warnings ?? [],
    keyIngredients: raw.keyIngredients ?? local?.keyIngredients ?? [],
    skinType: raw.skinType ?? local?.skinType ?? [],
    seo: seo ?? {
      title: `${name} | Ishaq Medical`,
      description: raw.shortDescription || name,
      indexable: true,
    },
    createdAt: raw.createdAt || local?.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || local?.updatedAt || new Date().toISOString(),
  };
}

export function hydrateProducts(list: unknown): Product[] {
  if (!Array.isArray(list)) return [];
  return list.map((row) => hydrateProduct(row as Partial<Product>)).filter((row): row is Product => Boolean(row));
}
