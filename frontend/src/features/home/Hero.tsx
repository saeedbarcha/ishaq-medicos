import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, ShieldCheck, Store } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { StorePhoto } from '@/components/common/ProductArt';
import { Button } from '@/components/ui/Button';
import { storePhotos } from '@/data/storeImages';
import { SearchBox } from '@/features/search/SearchBox';
import { storeSettings } from '@/data/storeSettings';

const departments = [
  { href: '/medicines', photo: storePhotos.medicines, label: 'Medicines', detail: 'OTC and prescription review' },
  { href: '/surgical', photo: storePhotos.surgical, label: 'Surgical', detail: 'Home and clinic devices' },
  { href: '/cosmetics', photo: storePhotos.cosmetics, label: 'Skin care', detail: 'Daily essentials, labelled as sold' },
];

const trust = [
  { icon: ShieldCheck, label: 'Pharmacist review for Rx' },
  { icon: Store, label: 'Counter pickup' },
  { icon: MapPin, label: 'Local GB retail' },
  { icon: ClipboardList, label: 'COD when confirmed' },
];

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(165deg,#e5f6fb_0%,#f7eee9_48%,#f4f8fa_100%)]">
      <div className="orb pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-teal/20 blur-3xl" />
      <div className="orb-delay pointer-events-none absolute -bottom-28 left-[-6rem] size-[22rem] rounded-full bg-brass/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-teal shadow-sm ring-1 ring-white">
            {storeSettings.region}
          </p>
          <h1 className="font-display mt-5 max-w-xl text-[2.45rem] font-semibold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
            The counter for medicines, surgical care and skin.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/70">
            Shop everyday care, send a prescription for pharmacist review, or pick up a device before you travel — from a
            Gilgit-Baltistan medical store, not a nationwide marketplace.
          </p>
          <div className="mt-7 max-w-xl">
            <SearchBox size="lg" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/medicines">Browse the catalog</Link>
            </Button>
            <Button asChild size="lg" variant="navy">
              <Link to="/prescription">Upload a prescription</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/surgical">Shop equipment</Link>
            </Button>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {trust.map((item) => (
              <li
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-sm text-ink/70 shadow-sm ring-1 ring-white/80"
              >
                <item.icon className="size-4 text-teal" aria-hidden />
                {item.label}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          className="relative"
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <StorePhoto
            src={storePhotos.hero}
            alt="Pharmacy counter with medicines, surgical packs and skin-care products on the shelves"
            className="photo-sheen h-[22rem] rounded-[2rem] shadow-[0_32px_70px_rgba(18,32,51,0.22)] ring-1 ring-white/60 lg:h-[34rem]"
          />
          <div className="absolute inset-x-3 bottom-3 grid gap-2 sm:grid-cols-3">
            {departments.map((card, index) => (
              <motion.div
                key={card.href}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + index * 0.08, duration: 0.45 }}
              >
                <Link
                  to={card.href}
                  className="group flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 shadow-[0_12px_30px_rgba(18,32,51,0.16)] ring-1 ring-white/70 backdrop-blur transition hover:-translate-y-0.5 hover:ring-teal"
                >
                  <StorePhoto src={card.photo} alt={card.label} className="size-12 shrink-0 rounded-xl" />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-navy">{card.label}</span>
                    <span className="block truncate text-[11px] text-ink/55">{card.detail}</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="mountain-rule mx-auto max-w-7xl" />
    </section>
  );
}
