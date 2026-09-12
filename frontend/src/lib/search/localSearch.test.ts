import { describe, expect, it } from 'vitest';
import { products } from '@/data/products';
import { searchLocalProducts } from '@/lib/search/localSearch';

describe('searchLocalProducts', () => {
  it('finds Panadol by salt name', () => {
    const hits = searchLocalProducts(products, 'paracetamol');
    expect(hits.some((item) => item.slug.includes('panadol'))).toBe(true);
  });

  it('finds a BP monitor by shorthand', () => {
    const hits = searchLocalProducts(products, 'bp');
    expect(hits.some((item) => item.slug.includes('bp') || item.searchKeywords.includes('blood pressure'))).toBe(true);
  });
});
