import { Link } from 'react-router-dom';
import { ProductArt, StorePhoto } from '@/components/common/ProductArt';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { QtyStepper } from '@/components/ui/QtyStepper';
import { ProductCard } from '@/features/products/ProductCard';
import { storePhotos } from '@/data/storeImages';
import { productRepository } from '@/repositories/productRepository';
import { findLocalProduct } from '@/lib/catalog/hydrateProduct';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeFromCart, setCartQuantity } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { formatPrice } from '@/lib/utils';

export function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const rows = items
    .map((item) => ({
      item,
      product: productRepository.getById(item.productId) ?? findLocalProduct(item.productId),
    }))
    .filter((row) => row.product);
  const subtotal = rows.reduce((sum, row) => sum + (row.product!.salePrice ?? row.product!.price) * row.item.quantity, 0);
  const rx = rows.some((row) => row.product?.prescriptionRequired);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Seo title="Your bag | Ishaq Medical" description="Review items in your bag." path="/cart" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Counter bag</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Bag</h1>
      {rows.length === 0 ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_44px_rgba(18,32,51,0.08)] ring-1 ring-line md:grid md:grid-cols-2">
          <StorePhoto src={storePhotos.visit} alt="" className="h-56 md:h-full" />
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <h2 className="font-display text-2xl font-semibold text-navy">Nothing in the bag yet</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Browse medicines, devices and skin care, or send a prescription if you already know what you need.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/medicines">Shop the catalog</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/prescription">Upload a prescription</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <ul className="space-y-4">
            {rows.map(({ item, product }) => (
              <li
                key={item.productId}
                className="flex flex-col gap-4 rounded-[1.4rem] bg-white p-4 shadow-[0_10px_28px_rgba(18,32,51,0.05)] ring-1 ring-line sm:flex-row sm:items-center"
              >
                <Link to={`/products/${product!.slug}`} className="shrink-0">
                  <ProductArt kind={product!.kind} name={product!.name} src={product!.images?.[0]?.url} className="h-28 w-32 rounded-2xl" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${product!.slug}`} className="font-semibold text-navy hover:text-teal">
                    {product!.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink/55">{product!.packSize}</p>
                  {product!.prescriptionRequired && <p className="mt-1 text-sm text-[#9b2c2c]">Needs prescription review</p>}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button className="text-sm font-medium text-teal" onClick={() => dispatch(toggleWishlist(item.productId))}>
                      Save for later
                    </button>
                    <button className="text-sm text-ink/45" onClick={() => dispatch(removeFromCart(item.productId))}>
                      Remove
                    </button>
                  </div>
                </div>
                <QtyStepper
                  value={item.quantity}
                  max={Math.max(product!.stock, 1)}
                  onChange={(quantity) => dispatch(setCartQuantity({ productId: item.productId, quantity }))}
                />
                <p className="w-24 text-right text-lg font-bold text-navy">{formatPrice((product!.salePrice ?? product!.price) * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-[1.5rem] bg-navy p-6 text-white shadow-[0_22px_50px_rgba(18,32,51,0.22)] lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Order preview</p>
            <p className="mt-4 text-sm text-white/60">Subtotal</p>
            <p className="text-3xl font-extrabold tracking-tight">{formatPrice(subtotal)}</p>
            <p className="mt-3 text-sm text-white/55">Delivery estimate: [to be confirmed]</p>
            {rx && <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-sm text-mint">This bag includes prescription items. Checkout will stay pending review.</p>}
            <Button asChild variant="brass" className="mt-5 w-full" size="lg">
              <Link to="/checkout">Checkout</Link>
            </Button>
            <Link to="/medicines" className="mt-3 block text-center text-sm text-white/70 hover:text-white">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

export function WishlistPage() {
  const ids = useAppSelector((s) => s.wishlist.productIds);
  const products = ids.map((id) => productRepository.getById(id) ?? findLocalProduct(id)).filter(Boolean);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Seo title="Wishlist | Ishaq Medical" description="Saved products." path="/wishlist" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Saved</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Wishlist</h1>
      {products.length === 0 ? (
        <div className="mt-8 rounded-[1.6rem] bg-white px-8 py-14 text-center ring-1 ring-line">
          <p className="font-display text-2xl font-semibold text-navy">Nothing saved yet</p>
          <p className="mt-2 text-sm text-ink/60">Tap the heart on a product to keep it here.</p>
          <Button asChild className="mt-5">
            <Link to="/medicines">Browse products</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => product && <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
