import { Link } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { ProductCard } from '@/features/products/ProductCard';
import { useGetBrandsQuery, useGetProductsQuery } from '@/store/api/catalogApi';

export function BrandsPage() {
  const { data } = useGetBrandsQuery();
  const brands = data?.data ?? [];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Seo title="Brands | Ishaq Medical" description="Shop by brand at Ishaq Medical in Gilgit-Baltistan." path="/brands" />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">On the shelf</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Brands</h1>
      <p className="mt-3 max-w-2xl text-ink/65">Names we stock in this catalog. Availability is confirmed at the counter.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={`/brands/${brand.slug}`}
            className="rounded-[1.3rem] bg-white p-6 shadow-[0_8px_20px_rgba(18,32,51,0.04)] ring-1 ring-line transition hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(1,97,141,0.1)] hover:ring-teal"
          >
            <span className="font-display text-xl font-semibold text-navy">{brand.logoText || brand.name}</span>
            <span className="mt-1 block text-sm text-ink/50">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BrandDetailsPage({ slug }: { slug: string }) {
  const { data: brandData } = useGetBrandsQuery();
  const brand = (brandData?.data ?? []).find((item) => item.slug === slug);
  const { data } = useGetProductsQuery({ brand: slug, limit: 24 });
  if (!brand) return <p className="p-8">Brand not found.</p>;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Seo title={brand.seo?.title ?? `${brand.name} | Ishaq Medical`} description={brand.seo?.description ?? brand.description} path={`/brands/${brand.slug}`} />
      <nav className="text-sm text-ink/55">
        <Link to="/brands" className="hover:text-teal">
          Brands
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-navy">{brand.name}</span>
      </nav>
      <h1 className="font-display mt-3 text-4xl font-semibold text-navy">{brand.name}</h1>
      <p className="mt-3 max-w-2xl text-ink/70">{brand.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.data ?? []).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export function DealsPage() {
  const { data } = useGetProductsQuery({ limit: 24 });
  const items = (data?.data ?? []).filter((p) => p.salePrice);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Seo title="Deals | Ishaq Medical" description="Products currently listed with a sale price." path="/deals" />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Marked prices</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Deals</h1>
      <p className="mt-3 max-w-2xl text-ink/65">Sale prices shown in the catalog. Live promotions will replace this list when the store publishes them.</p>
      {items.length === 0 ? (
        <div className="mt-8 rounded-[1.6rem] bg-white px-8 py-14 text-center ring-1 ring-line">
          <p className="font-display text-2xl font-semibold text-navy">No marked deals right now</p>
          <p className="mt-2 text-sm text-ink/60">Browse the catalog for regular shelf prices.</p>
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
