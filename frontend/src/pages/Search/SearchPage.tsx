import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/features/products/ProductCard';
import { useSearchCatalogQuery } from '@/store/api/catalogApi';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const query = useMemo(() => ({ search: q, page: 1, limit: 24 }), [q]);
  const { data, isLoading } = useSearchCatalogQuery(query);
  const items = data?.data.items ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Seo title={`Search: ${q} | Ishaq Medical`} description="Search results" path="/search" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Catalog search</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Search</h1>
      <p className="mt-2 text-ink/65">{q ? `Results for “${q}”` : 'Type a salt name, brand, SKU or device.'}</p>
      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shimmer h-80 rounded-[1.35rem]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-[1.6rem] bg-white px-8 py-14 text-center shadow-[0_12px_32px_rgba(18,32,51,0.05)] ring-1 ring-line">
          <p className="font-display text-2xl font-semibold text-navy">No matches</p>
          <p className="mt-2 text-sm text-ink/60">Try the generic name, a shorter brand name, or browse an aisle.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild>
              <Link to="/medicines">Medicines</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/surgical">Equipment</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
