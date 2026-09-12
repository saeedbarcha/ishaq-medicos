import { Heart, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { DataSourceBanner } from '@/components/common/DataSourceBanner';
import { Logo } from '@/components/common/Logo';
import { StorePhoto } from '@/components/common/ProductArt';
import { Button } from '@/components/ui/Button';
import { SearchBox } from '@/features/search/SearchBox';
import { storeSettings } from '@/data/storeSettings';
import { getRootCategories, getSubcategories } from '@/data/categories';
import { storePhotos } from '@/data/storeImages';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

const aislePhoto: Record<string, string> = {
  medicines: storePhotos.medicines,
  otc: storePhotos.medicines,
  surgical: storePhotos.surgical,
  cosmetics: storePhotos.cosmetics,
  'mother-baby': storePhotos.motherBaby,
};

const links = [
  { to: '/medicines', label: 'Medicines' },
  { to: '/otc', label: 'OTC' },
  { to: '/surgical', label: 'Surgical' },
  { to: '/cosmetics', label: 'Cosmetics' },
  { to: '/mother-baby', label: 'Mother & Baby' },
  { to: '/brands', label: 'Brands' },
  { to: '/deals', label: 'Deals' },
  { to: '/prescription', label: 'Prescription' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const cartCount = useAppSelector((s) => s.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishCount = useAppSelector((s) => s.wishlist.productIds.length);
  const roots = getRootCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-teal text-[12px] font-medium text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
          <span className="hidden shrink-0 sm:inline">Counter pickup · {storeSettings.region}</span>
          <p className="flex-1 text-center">{storeSettings.announcement}</p>
          <Link to="/track-order" className="hidden shrink-0 underline-offset-2 hover:underline sm:inline">
            Track order
          </Link>
        </div>
      </div>
      <DataSourceBanner />
      <div className={cn('border-b border-line bg-white/90 backdrop-blur-md transition-shadow duration-300', scrolled && 'shadow-[0_16px_40px_rgba(18,32,51,0.08)]')}>
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <button className="grid size-11 place-items-center rounded-full lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </button>
          <Logo />
          <SearchBox className="hidden flex-1 md:block" />
          <div className="ml-auto flex items-center gap-1">
            <Button asChild variant="navy" size="sm" className="hidden xl:inline-flex">
              <Link to="/prescription">Upload prescription</Link>
            </Button>
            <Link to="/account" aria-label="Account" className="grid size-11 place-items-center rounded-full transition hover:scale-105 hover:bg-mist">
              <UserRound className="size-5" />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative grid size-11 place-items-center rounded-full transition hover:scale-105 hover:bg-mist">
              <Heart className="size-5" />
              {wishCount > 0 && <span className="count-pop absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-teal text-[10px] text-white">{wishCount}</span>}
            </Link>
            <Link to="/cart" aria-label="Bag" className="relative grid size-11 place-items-center rounded-full transition hover:scale-105 hover:bg-mist">
              <ShoppingBag className="size-5" />
              {cartCount > 0 && <span className="count-pop absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-navy text-[10px] text-white">{cartCount}</span>}
            </Link>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <SearchBox />
        </div>
        <nav className="relative hidden border-t border-line lg:block" aria-label="Primary">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4">
            <div onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}>
              <button className="px-3 py-3 text-sm font-semibold text-navy" aria-expanded={shopOpen}>
                Shop
              </button>
              {shopOpen && (
                <div className="absolute left-0 right-0 z-30 animate-[fadeSlide_0.22s_ease] border-b border-line bg-white shadow-[0_28px_70px_rgba(18,32,51,0.12)]">
                  <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 px-4 py-8">
                    {roots.slice(0, 4).map((root) => (
                      <div key={root.id}>
                        <Link to={`/${root.slug}`} className="group block overflow-hidden rounded-2xl">
                          <StorePhoto src={aislePhoto[root.slug] ?? storePhotos.hero} alt="" className="h-24" />
                        </Link>
                        <Link to={`/${root.slug}`} className="mt-3 block font-bold text-navy hover:text-teal">
                          {root.name}
                        </Link>
                        <ul className="mt-3 space-y-2 text-sm text-ink/70">
                          {getSubcategories(root.id).slice(0, 6).map((sub) => (
                            <li key={sub.id}>
                              <Link className="hover:text-teal" to={`/${root.slug}/${sub.slug}`}>
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn('nav-link px-3 py-3 text-sm font-semibold text-ink/70 hover:text-teal', isActive && 'text-teal')
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/blog" className="ml-auto px-3 py-3 text-sm font-semibold text-ink/70 hover:text-teal">
              Health guides
            </NavLink>
            <NavLink to="/team" className="px-3 py-3 text-sm font-semibold text-ink/70 hover:text-teal">
              Team
            </NavLink>
            <NavLink to="/contact" className="px-3 py-3 text-sm font-semibold text-ink/70 hover:text-teal">
              Contact
            </NavLink>
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-navy/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,22rem)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <Logo compact />
              <button className="grid size-11 place-items-center" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Shop</p>
              <ul className="mt-2 space-y-1">
                {roots.map((root) => (
                  <li key={root.id}>
                    <Link className="block rounded-xl px-2 py-2 font-semibold" to={`/${root.slug}`} onClick={() => setMobileOpen(false)}>
                      {root.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-teal">Also</p>
              <ul className="mt-2 space-y-1">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link className="block rounded-xl px-2 py-2" to={link.to} onClick={() => setMobileOpen(false)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link className="block rounded-xl px-2 py-2" to="/blog" onClick={() => setMobileOpen(false)}>
                    Health guides
                  </Link>
                </li>
                <li>
                  <Link className="block rounded-xl px-2 py-2" to="/team" onClick={() => setMobileOpen(false)}>
                    Team
                  </Link>
                </li>
                <li>
                  <Link className="block rounded-xl px-2 py-2" to="/contact" onClick={() => setMobileOpen(false)}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link className="block rounded-xl px-2 py-2" to="/account" onClick={() => setMobileOpen(false)}>
                    Account
                  </Link>
                </li>
              </ul>
              <div className="mt-6 grid gap-2">
                <Link className="rounded-xl bg-navy px-4 py-3 text-center font-semibold text-white" to="/prescription" onClick={() => setMobileOpen(false)}>
                  Upload prescription
                </Link>
                <Link className="rounded-xl border border-line px-4 py-3 text-center font-semibold" to="/track-order" onClick={() => setMobileOpen(false)}>
                  Track order
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
