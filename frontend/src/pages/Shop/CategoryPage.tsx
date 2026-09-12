import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { StorePhoto } from '@/components/common/ProductArt';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/features/products/ProductCard';
import { categories, getCategoryBySlug, healthNeeds } from '@/data/categories';
import { brands } from '@/data/brands';
import { storePhotos } from '@/data/storeImages';
import { useGetProductsQuery } from '@/store/api/catalogApi';
import type { ProductQuery } from '@shared/types';

const slugAliases: Record<string, string> = {
  'vitamins-supplements': 'vitamins-supplements',
  'mother-baby': 'mother-baby',
  'personal-care': 'personal-care',
  'skin-care': 'skin-care',
  'medical-equipment': 'medical-equipment',
};

const aislePhoto: Record<string, string> = {
  medicines: storePhotos.medicines,
  otc: storePhotos.medicines,
  surgical: storePhotos.surgical,
  cosmetics: storePhotos.cosmetics,
  'mother-baby': storePhotos.motherBaby,
  'vitamins-supplements': storePhotos.medicines,
  'personal-care': storePhotos.cosmetics,
  'skin-care': storePhotos.cosmetics,
  'medical-equipment': storePhotos.surgical,
};

export function CategoryPage({ forcedSlug, healthNeed }: { forcedSlug?: string; healthNeed?: string }) {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = forcedSlug ?? params.sub ?? params.department ?? '';
  const category = getCategoryBySlug(slugAliases[slug] ?? slug);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');

  const query: ProductQuery = useMemo(
    () => ({
      category: healthNeed ? undefined : category?.slug,
      healthNeed,
      brand: searchParams.get('brand') ?? undefined,
      sort: (searchParams.get('sort') as ProductQuery['sort']) ?? 'relevance',
      inStock: searchParams.get('inStock') === '1' ? true : undefined,
      prescriptionRequired: searchParams.get('rx') === '0' ? false : searchParams.get('rx') === '1' ? true : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: Number(searchParams.get('page') ?? 1),
      limit: 12,
    }),
    [category?.slug, healthNeed, searchParams, minPrice, maxPrice],
  );

  const { data, isLoading } = useGetProductsQuery(query);
  const items = data?.data ?? [];
  const meta = data?.meta;
  const need = healthNeeds.find((item) => item.slug === healthNeed);
  const title = need?.name ?? category?.name ?? 'Shop';
  const intro = need
    ? `${need.description} This is product discovery — not a diagnosis.`
    : category?.intro ?? 'Browse the catalog.';
  const subs = categories.filter((item) => item.parentId === category?.id);
  const photo = aislePhoto[category?.slug ?? slug] ?? aislePhoto[slug] ?? storePhotos.medicines;

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }

  return (
    <div className="pb-12">
      <Seo
        title={category?.seo.title ?? `${title} | Ishaq Medical`}
        description={category?.seo.description ?? intro}
        path={`/${slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
            { '@type': 'ListItem', position: 2, name: title },
          ],
        }}
      />
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="shop-hero rounded-[2rem] shadow-[0_24px_50px_rgba(18,32,51,0.14)]">
        <StorePhoto src={photo} alt="" className="h-48 w-full rounded-[2rem] lg:h-64" />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 lg:p-10">
          <nav className="text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-white">{title}</span>
          </nav>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-white lg:text-5xl">{category?.name ?? title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 lg:text-base">{intro}</p>
        </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        {subs.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {subs.map((sub) => (
              <Link
                key={sub.id}
                to={`/${category?.slug}/${sub.slug}`}
                className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium shadow-[0_6px_16px_rgba(18,32,51,0.06)] ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-teal"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="h-fit rounded-[1.4rem] bg-white p-5 shadow-[0_12px_32px_rgba(18,32,51,0.05)] ring-1 ring-line">
            <p className="text-sm font-bold text-navy">Filter the aisle</p>
            <label className="mt-4 block text-sm font-medium">
              Brand
              <select
                className="mt-1 h-11 w-full rounded-xl border border-line px-3"
                value={searchParams.get('brand') ?? ''}
                onChange={(event) => setParam('brand', event.target.value)}
              >
                <option value="">All brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={searchParams.get('inStock') === '1'}
                onChange={(event) => setParam('inStock', event.target.checked ? '1' : '')}
              />
              In stock only
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={searchParams.get('rx') === '1'}
                onChange={(event) => setParam('rx', event.target.checked ? '1' : '')}
              />
              Prescription items
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <input className="h-11 rounded-xl border border-line px-3 text-sm" placeholder="Min Rs" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input className="h-11 rounded-xl border border-line px-3 text-sm" placeholder="Max Rs" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <p className="mt-6 text-xs leading-relaxed text-ink/45">
              Filter URLs are not canonical. The category page without query parameters is the one we want indexed.
            </p>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-ink/60">
                <span className="font-semibold text-navy">{meta?.total ?? 0}</span> products
              </p>
              <select
                className="h-11 rounded-xl border border-line bg-white px-3 text-sm shadow-sm"
                value={searchParams.get('sort') ?? 'relevance'}
                onChange={(event) => setParam('sort', event.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name-asc">Name</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="shimmer h-80 rounded-[1.35rem]" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-[1.6rem] bg-white px-8 py-14 text-center shadow-[0_12px_32px_rgba(18,32,51,0.05)] ring-1 ring-line">
                <p className="font-display text-2xl font-semibold text-navy">Nothing matches these filters</p>
                <p className="mt-2 text-sm text-ink/60">Clear filters or try search by salt name or brand.</p>
                <Button asChild className="mt-5" variant="outline">
                  <Link to={`/${category?.slug ?? 'medicines'}`}>Reset aisle</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: meta.totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={`size-10 rounded-full text-sm font-semibold transition ${meta.page === index + 1 ? 'bg-teal text-white shadow-[0_8px_18px_rgba(1,97,141,0.28)]' : 'bg-white ring-1 ring-line hover:ring-teal'}`}
                    onClick={() => setParam('page', String(index + 1))}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            {category?.seoContent && <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink/60">{category.seoContent}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
