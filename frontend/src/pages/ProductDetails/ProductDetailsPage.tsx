import { Heart, MessageCircle, ShoppingBag, Store } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { StorePhoto } from '@/components/common/ProductArt';
import { Seo } from '@/components/common/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { ProductCard } from '@/features/products/ProductCard';
import { getBrandById, getManufacturerById } from '@/data/brands';
import { getCategoryById } from '@/data/categories';
import { photosForProduct } from '@/data/storeImages';
import { storeSettings } from '@/data/storeSettings';
import { cn, discountPercent, formatPrice, stockLabel, whatsappUrl } from '@/lib/utils';
import { useGetProductQuery } from '@/store/api/catalogApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { rememberProduct } from '@/store/slices/recentlyViewedSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { productRepository } from '@/repositories/productRepository';
import { hydrateProduct, hydrateProducts } from '@/lib/catalog/hydrateProduct';

type Tab = 'about' | 'use' | 'caution';

export function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const { data, isLoading, isError } = useGetProductQuery(slug);
  const product = hydrateProduct(data?.data.product) ?? data?.data.product;
  const related = hydrateProducts(data?.data.related ?? []);
  const dispatch = useAppDispatch();
  const wished = useAppSelector((s) =>
    product ? s.wishlist.productIds.includes(product.id) || s.wishlist.productIds.includes(product.slug) : false,
  );
  const recentIds = useAppSelector((s) => s.recentlyViewed.productIds);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<Tab>('about');

  const gallery = useMemo(
    () => (product ? photosForProduct(product.kind, product.name, product.images) : []),
    [product],
  );

  useEffect(() => {
    if (product) dispatch(rememberProduct(product.slug));
  }, [product, dispatch]);

  useEffect(() => {
    setActive(0);
    setQty(1);
    setTab('about');
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
        <div className="shimmer aspect-square rounded-[2rem]" />
        <div className="space-y-4 pt-6">
          <div className="shimmer h-4 w-24 rounded-full" />
          <div className="shimmer h-10 w-3/4 rounded-xl" />
          <div className="shimmer h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-navy">We could not find that product</h1>
        <p className="mt-3 text-ink/60">It may have been moved, or the catalog id does not match this storefront.</p>
        <Button asChild className="mt-6">
          <Link to="/medicines">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const brand = getBrandById(product.brandId);
  const manufacturer = getManufacturerById(product.manufacturerId);
  const category = getCategoryById(product.categoryId);
  const stock = stockLabel(Number(product.stock), Number(product.lowStockThreshold ?? 5));
  const off = discountPercent(product.price, product.salePrice);
  const display = product.salePrice ?? product.price;
  const recent = recentIds.map((id) => productRepository.getById(id)).filter(Boolean);
  const out = Number(product.stock) <= 0;
  const maxQty = Math.max(product.stock, 1);

  const hasUse = Boolean(product.directions || product.keyIngredients?.length || product.storage);
  const hasCaution = Boolean(product.warnings?.length);

  function add() {
    dispatch(addToCart({ productId: product.slug, quantity: qty }));
    toast.success('Added to bag');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 lg:pb-12">
      <Seo
        title={product.seo?.title ?? `${product.name} | Ishaq Medical`}
        description={product.seo?.description ?? product.shortDescription}
        path={`/products/${product.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription,
          sku: product.sku,
          gtin13: product.barcode,
          brand: brand?.name,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: display,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />
      <nav className="text-sm text-ink/55">
        <Link to="/" className="hover:text-teal">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <Link to={`/${category?.slug}`} className="hover:text-teal">
          {category?.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_60px_rgba(18,32,51,0.1)] ring-1 ring-line">
            <AnimatePresence mode="wait">
              <motion.div
                key={gallery[active]}
                initial={{ opacity: 0.4, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                <StorePhoto src={gallery[active]} alt={product.name} className="photo-sheen aspect-square rounded-[1.65rem]" />
              </motion.div>
            </AnimatePresence>
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(index)}
                  className={cn(
                    'overflow-hidden rounded-2xl ring-2 ring-transparent transition',
                    index === active ? 'ring-teal shadow-[0_8px_20px_rgba(0,167,212,0.18)]' : 'hover:ring-line',
                  )}
                >
                  <StorePhoto src={src} alt="" className="aspect-square" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">{brand?.name}</p>
          <h1 className="font-display mt-2 text-[2rem] font-semibold leading-[1.15] tracking-tight text-navy lg:text-[2.35rem]">
            {product.name}
          </h1>
          <p className="mt-2 text-ink/60">{product.packSize}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.prescriptionRequired && <Badge tone="rx">Prescription required</Badge>}
            {product.controlledMedicine && <Badge tone="danger">Controlled medicine</Badge>}
            <Badge tone={stock.tone === 'ok' ? 'ok' : stock.tone === 'warn' ? 'warn' : 'danger'}>{stock.label}</Badge>
            {off ? <Badge tone="sale">-{off}%</Badge> : null}
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-navy">{formatPrice(display)}</span>
            {product.salePrice ? <span className="pb-1 text-lg text-ink/35 line-through">{formatPrice(product.price)}</span> : null}
          </div>

          {product.genericName && (
            <p className="mt-4 rounded-2xl bg-teal-soft/70 px-4 py-3 text-sm text-teal-deep">
              <span className="font-semibold">Generic / salt:</span> {product.genericName}
              {product.strength ? ` · ${product.strength}` : ''}
              {product.dosageForm ? ` · ${product.dosageForm}` : ''}
            </p>
          )}
          <p className="mt-4 leading-relaxed text-ink/75">{product.shortDescription}</p>

          <div className="mt-6 hidden items-center gap-3 sm:flex">
            <QtyStepper value={qty} max={maxQty} onChange={setQty} />
            <Button disabled={out} size="lg" onClick={add}>
              <ShoppingBag className="size-4" /> {out ? 'Out of stock' : 'Add to bag'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => dispatch(toggleWishlist(product.slug))} aria-label="Wishlist">
              <Heart className={wished ? 'size-4 fill-current text-[#9b2c2c]' : 'size-4'} />
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                const url = whatsappUrl(
                  storeSettings.placeholders.whatsapp ? undefined : storeSettings.whatsapp,
                  `Enquiry: ${product.name} (${window.location.href})`,
                );
                if (!url) toast.message('WhatsApp number is not published yet.');
                else window.open(url, '_blank', 'noopener,noreferrer');
              }}
            >
              <MessageCircle className="size-4" /> WhatsApp enquiry
            </Button>
            <span className="inline-flex items-center gap-1.5 self-center text-sm text-ink/55">
              <Store className="size-4 text-teal" /> Counter pickup available
            </span>
          </div>
          <p className="mt-2 text-xs text-ink/45">Delivery details are placeholders until the store confirms them.</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 rounded-[1.4rem] bg-white p-5 text-sm shadow-[0_10px_28px_rgba(18,32,51,0.05)] ring-1 ring-line">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">SKU</dt>
              <dd className="mt-0.5 font-medium">{product.sku}</dd>
            </div>
            {product.barcode && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Barcode</dt>
                <dd className="mt-0.5 font-medium">{product.barcode}</dd>
              </div>
            )}
            {manufacturer && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Manufacturer</dt>
                <dd className="mt-0.5 font-medium">{manufacturer.name}</dd>
              </div>
            )}
            {product.model && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Model</dt>
                <dd className="mt-0.5 font-medium">{product.model}</dd>
              </div>
            )}
            {product.warranty && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Warranty</dt>
                <dd className="mt-0.5 font-medium">{product.warranty}</dd>
              </div>
            )}
            {product.skinType && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Skin type</dt>
                <dd className="mt-0.5 font-medium">{product.skinType.join(', ')}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-[1.6rem] bg-white shadow-[0_12px_32px_rgba(18,32,51,0.06)] ring-1 ring-line lg:col-span-2">
          <div className="flex gap-1 border-b border-line px-3 pt-3">
            {(
              [
                ['about', 'About'],
                hasUse ? ['use', 'How to use'] : null,
                hasCaution ? ['caution', 'Cautions'] : null,
              ] as Array<[Tab, string] | null>
            )
              .filter(Boolean)
              .map((item) => {
                const [id, label] = item!;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={cn(
                      'rounded-t-xl px-4 py-2.5 text-sm font-semibold transition',
                      tab === id ? 'bg-mist text-navy' : 'text-ink/50 hover:text-teal',
                    )}
                  >
                    {label}
                  </button>
                );
              })}
          </div>
          <div className="p-6">
            {tab === 'about' && (
              <>
                <p className="text-sm leading-relaxed text-ink/75">{product.description}</p>
                {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 ? (
                  <dl className="mt-5 grid gap-0 text-sm">
                    {Object.entries(product.technicalSpecs).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5 last:border-0">
                        <dt className="text-ink/50">{k}</dt>
                        <dd className="font-medium text-navy">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </>
            )}
            {tab === 'use' && (
              <div className="space-y-4 text-sm leading-relaxed text-ink/75">
                {product.directions && (
                  <p>
                    <span className="font-semibold text-navy">Directions:</span> {product.directions}
                  </p>
                )}
                {product.keyIngredients?.length ? (
                  <p>
                    <span className="font-semibold text-navy">Key ingredients:</span> {product.keyIngredients.join(', ')}
                  </p>
                ) : null}
                {product.storage && (
                  <p>
                    <span className="font-semibold text-navy">Storage:</span> {product.storage}
                  </p>
                )}
              </div>
            )}
            {tab === 'caution' && product.warnings?.length ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/75">
                {product.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
        <aside className="rounded-[1.6rem] bg-[linear-gradient(165deg,#00A7D4,#007ea3)] p-6 text-sm leading-relaxed text-white shadow-[0_18px_40px_rgba(0,167,212,0.28)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Pharmacist note</p>
          <p className="mt-3">
            This page is catalog information. It is not a personal treatment plan. Follow the pack and your clinician.
          </p>
          {product.prescriptionRequired && (
            <Link to="/prescription" className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-teal">
              Upload a prescription
            </Link>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-navy">Often picked with this</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-navy">Recently viewed</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent
              .filter((item) => item && item.slug !== product.slug && item.id !== product.id)
              .slice(0, 4)
              .map((item) => item && <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 pr-20 shadow-[0_-12px_32px_rgba(18,32,51,0.1)] backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink/50">{product.name}</p>
            <p className="font-bold text-navy">{formatPrice(display)}</p>
          </div>
          <QtyStepper value={qty} max={maxQty} onChange={setQty} />
          <Button disabled={out} onClick={add}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
