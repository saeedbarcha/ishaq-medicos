import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { banners, deals } from '../src/data/banners.ts';
import { blogPosts } from '../src/data/blogPosts.ts';
import { brands, manufacturers } from '../src/data/brands.ts';
import { categories } from '../src/data/categories.ts';
import { deliveryZones, faqs } from '../src/data/deliveryZones.ts';
import { products } from '../src/data/products.ts';
import { reviews } from '../src/data/reviews.ts';
import { storeSettings } from '../src/data/storeSettings.ts';

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../backend/src/database/fixtures');
mkdirSync(outDir, { recursive: true });

function strip<T extends { id: string }>(rows: T[]) {
  return rows.map(({ id, ...rest }) => ({ catalogId: id, ...rest }));
}

const payload = {
  categories: strip(categories),
  brands: strip(brands),
  manufacturers: strip(manufacturers),
  products: products.map(({ id, createdAt, updatedAt, attributes, ...rest }) => ({
    catalogId: id,
    ...rest,
    attributes: attributes && typeof attributes === 'object' ? attributes : {},
  })),
  banners: strip(banners),
  deals: strip(deals),
  faqs: strip(faqs),
  blogPosts: strip(blogPosts),
  reviews: strip(reviews),
  deliveryZones: strip(deliveryZones),
  storeSettings,
};

writeFileSync(resolve(outDir, 'catalog.json'), JSON.stringify(payload));
console.log(
  `Wrote catalog fixture: ${payload.products.length} products, ${payload.categories.length} categories, ${payload.brands.length} brands`,
);
