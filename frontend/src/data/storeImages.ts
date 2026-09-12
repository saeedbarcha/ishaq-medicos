import type { ProductKind } from '@shared/types';

export const storePhotos = {
  hero: '/images/hero-pharmacy.jpg',
  medicines: '/images/aisle-medicines.jpg',
  surgical: '/images/aisle-surgical.jpg',
  cosmetics: '/images/aisle-cosmetics.jpg',
  motherBaby: '/images/aisle-mother-baby.jpg',
  visit: '/images/visit-counter.jpg',
  howItWorks: '/images/how-it-works.jpg',
} as const;

const kindPhotos: Record<ProductKind, string[]> = {
  medicine: [
    '/images/products/medicine.jpg',
    '/images/products/medicine-pills.jpg',
    '/images/products/medicine-bottles.jpg',
    '/images/aisle-medicines.jpg',
  ],
  surgical: ['/images/products/surgical.jpg', '/images/products/surgical-clinic.jpg', '/images/aisle-surgical.jpg'],
  cosmetic: ['/images/products/cosmetic.jpg', '/images/products/cosmetic-bottles.jpg', '/images/aisle-cosmetics.jpg'],
  'personal-care': ['/images/products/personal-care.jpg', '/images/products/cosmetic-bottles.jpg'],
  'mother-baby': ['/images/products/mother-baby.jpg', '/images/aisle-mother-baby.jpg'],
  supplement: ['/images/products/supplement.jpg', '/images/products/medicine-pills.jpg'],
};

export const blogCovers: Record<string, string> = {
  'using-medicines-safely-at-home': '/images/blog/medicine-safety.jpg',
  'how-to-upload-a-prescription': '/images/blog/prescription.jpg',
  'building-a-home-first-aid-kit': '/images/blog/first-aid.jpg',
  'choosing-a-blood-pressure-monitor': '/images/blog/bp-monitor.jpg',
  'gentle-skin-care-in-dry-mountain-weather': '/images/blog/skin-care.jpg',
  'baby-care-essentials-for-home': '/images/blog/baby-care.jpg',
};

export function seedFrom(value: string) {
  let n = 0;
  for (let i = 0; i < value.length; i += 1) n = (n * 31 + value.charCodeAt(i)) >>> 0;
  return n;
}

export function photoForKind(kind: ProductKind, seed = 0) {
  const list = kindPhotos[kind] ?? kindPhotos.medicine;
  return list[Math.abs(seed) % list.length];
}

export function isUsablePhoto(url?: string) {
  return Boolean(url && url.length > 4 && !url.endsWith('.svg'));
}

export function productPhoto(kind: ProductKind, name: string, url?: string) {
  return isUsablePhoto(url) ? url! : photoForKind(kind, seedFrom(name));
}

export function photosForProduct(kind: ProductKind, name: string, urls?: Array<{ url: string }>) {
  const fromProduct = (urls ?? []).map((item) => item.url).filter(isUsablePhoto);
  const extras = kindPhotos[kind] ?? kindPhotos.medicine;
  const out = [...fromProduct];
  for (const url of extras) {
    if (!out.includes(url)) out.push(url);
    if (out.length >= 4) break;
  }
  if (out.length === 0) out.push(photoForKind(kind, seedFrom(name)));
  return out;
}
