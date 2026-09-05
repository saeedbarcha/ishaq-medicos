import { Heart, ShoppingBag } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { Product } from '@shared/types';
import { ProductArt } from '@/components/common/ProductArt';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getBrandById } from '@/data/brands';
import { cn, discountPercent, formatPrice, stockLabel } from '@/lib/utils';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const dispatch = useAppDispatch();
  const reduce = useReducedMotion();
  const wished = useAppSelector((s) => s.wishlist.productIds.includes(product.id) || s.wishlist.productIds.includes(product.slug));
  const brand = getBrandById(product.brandId);
  const sale = product.salePrice;
  const off = discountPercent(product.price, sale);
  const stock = stockLabel(Number(product.stock), Number(product.lowStockThreshold ?? 5));
  const display = sale ?? product.price;
  const out = Number(product.stock) <= 0;

  function add() {
    dispatch(addToCart({ productId: product.slug }));
    toast.success(`${product.name} added to bag`);
  }

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduce ? undefined : { y: -8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-line bg-white p-2.5 shadow-[0_10px_28px_rgba(18,32,51,0.05)] transition-colors hover:border-teal/35 hover:shadow-[0_24px_50px_rgba(18,32,51,0.12)]',
        className,
      )}
    >
      <Link to={`/products/${product.slug}`} className="relative block overflow-hidden rounded-[1.05rem]">
        <ProductArt kind={product.kind} name={product.name} src={product.images?.[0]?.url} className="photo-sheen aspect-[4/3]" />
        <div className="absolute left-2.5 top-2.5 z-[3] flex flex-col gap-1">
          {product.prescriptionRequired && <Badge tone="rx">Rx</Badge>}
          {off ? <Badge tone="sale">-{off}%</Badge> : null}
        </div>
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          className={cn(
            'absolute right-2.5 top-2.5 z-[3] grid size-9 place-items-center rounded-full bg-white/92 text-ink shadow-md backdrop-blur transition hover:scale-110',
            wished && 'text-[#9b2c2c]',
          )}
          onClick={(event) => {
            event.preventDefault();
            dispatch(toggleWishlist(product.slug));
          }}
        >
          <Heart className={cn('size-4 transition', wished && 'fill-current')} />
        </button>
        <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 z-[3] hidden translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <span className="block rounded-full bg-navy/90 px-3 py-1.5 text-center text-[11px] font-semibold tracking-wide text-white backdrop-blur">
            View product
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">{brand?.name}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[2.6em] font-semibold leading-snug text-navy">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-ink/55">{product.packSize}</p>
        <div className="mt-auto pt-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-lg font-bold tracking-tight text-navy">{formatPrice(display)}</span>
              {sale ? <span className="ml-2 text-sm text-ink/35 line-through">{formatPrice(product.price)}</span> : null}
            </div>
            <Badge tone={stock.tone === 'ok' ? 'ok' : stock.tone === 'warn' ? 'warn' : 'danger'}>{stock.label}</Badge>
          </div>
          <Button className="mt-3 w-full" disabled={out} onClick={add}>
            <ShoppingBag className="size-4" />
            {out ? 'Out of stock' : product.prescriptionRequired ? 'Add (Rx review)' : 'Add to bag'}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
