import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Baby,
  ClipboardList,
  HeartPulse,
  MessageCircle,
  Package,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Sun,
  Thermometer,
} from 'lucide-react';
import { toast } from 'sonner';
import { Reveal, Stagger, StaggerItem } from '@/components/common/Motion';
import { ProductArt, StorePhoto } from '@/components/common/ProductArt';
import { Badge } from '@/components/ui/Badge';
import { storePhotos } from '@/data/storeImages';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/features/products/ProductCard';
import { healthNeeds } from '@/data/categories';
import { storeSettings } from '@/data/storeSettings';
import { formatPrice, whatsappUrl } from '@/lib/utils';
import { useGetProductsQuery } from '@/store/api/catalogApi';
import { useGetTeamQuery } from '@/store/api/storeApi';
import { TeamGrid } from '@/features/team/TeamGrid';
import type { Product, ProductQuery } from '@shared/types';

export function Section({
  title,
  kicker,
  intro,
  action,
  tone = 'plain',
  children,
}: {
  title: string;
  kicker?: string;
  intro?: string;
  action?: { to: string; label: string };
  tone?: 'plain' | 'white' | 'sand';
  children: ReactNode;
}) {
  const wrap = tone === 'white' ? 'bg-white' : tone === 'sand' ? 'bg-sand' : '';
  return (
    <section className={wrap}>
      <Reveal className="mx-auto max-w-7xl px-4 py-14 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {kicker && <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">{kicker}</p>}
            <h2 className="font-display mt-1 text-3xl font-semibold tracking-tight text-navy lg:text-[2.15rem]">{title}</h2>
            {intro ? <p className="mt-3 text-base leading-relaxed text-ink/65">{intro}</p> : null}
          </div>
          {action && (
            <Link to={action.to} className="shrink-0 text-sm font-semibold text-teal transition hover:translate-x-0.5 hover:text-teal-deep">
              {action.label}
            </Link>
          )}
        </div>
        {children}
      </Reveal>
    </section>
  );
}

export function ProductRail({ query, empty }: { query: ProductQuery; empty: string }) {
  const { data, isLoading } = useGetProductsQuery(query);
  const items = data?.data ?? [];
  if (isLoading) {
    return (
      <div className="product-rail">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-line" />
        ))}
      </div>
    );
  }
  if (!items.length) return <p className="text-sm text-ink/60">{empty}</p>;
  return (
    <div className="product-rail">
      {items.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ServiceBar() {
  const items = [
    { to: '/prescription', icon: ClipboardList, title: 'Prescription review', body: 'Photo or PDF. A pharmacist checks it before we dispense.' },
    { to: '/track-order', icon: Package, title: 'Track an order', body: 'Use the public reference from your confirmation.' },
    { to: '/delivery', icon: Store, title: 'Collect at the counter', body: 'Pickup stays the reliable option until routes are confirmed.' },
    { to: '/contact', icon: MessageCircle, title: 'Ask the store', body: 'Availability and surgical sizes — not a diagnosis inbox.' },
  ];
  return (
    <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-4">
      <div className="grid gap-3 rounded-[1.6rem] bg-navy p-3 text-white shadow-[0_28px_60px_rgba(18,32,51,0.28)] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-2xl px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/10">
            <item.icon className="size-5 text-mint" aria-hidden />
            <p className="mt-3 font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-white/65">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function DepartmentShowcase() {
  const departments: Array<{
    href: string;
    photo: string;
    kicker: string;
    title: string;
    copy: string;
    links: Array<[string, string]>;
    theme: string;
    chip: string;
  }> = [
    {
      href: '/medicines',
      photo: storePhotos.medicines,
      kicker: 'Pharmacy',
      title: 'Medicines',
      copy: 'Everyday OTC on the shelf. Anything marked Rx stays in a separate review before we prepare it.',
      links: [
        ['Pain & fever', '/health-needs/pain-fever'],
        ['Cold & flu', '/health-needs/cold-flu'],
        ['Upload Rx', '/prescription'],
      ],
      theme: 'bg-teal text-white',
      chip: 'bg-white/15 ring-white/20',
    },
    {
      href: '/surgical',
      photo: storePhotos.surgical,
      kicker: 'Clinic & home',
      title: 'Surgical & equipment',
      copy: 'BP monitors, glucometers, mobility aids and consumables — useful before a clinic visit or a long road.',
      links: [
        ['Monitoring', '/surgical'],
        ['First aid', '/health-needs/first-aid'],
        ['All devices', '/surgical'],
      ],
      theme: 'bg-navy text-white',
      chip: 'bg-white/15 ring-white/20',
    },
    {
      href: '/cosmetics',
      photo: storePhotos.cosmetics,
      kicker: 'Daily skin',
      title: 'Cosmetics & care',
      copy: 'Cleansers, moisturisers and sun care labelled as sold. This aisle is retail, not a dermatology clinic.',
      links: [
        ['Skin care', '/skin-care'],
        ['Mother & baby', '/mother-baby'],
        ['Personal care', '/personal-care'],
      ],
      theme: 'bg-sand text-navy',
      chip: 'bg-white ring-line',
    },
  ];

  return (
    <Section
      kicker="Three aisles"
      title="What the store actually sells"
      intro="Ishaq Medical is a local retail counter with three verticals. Pick an aisle, or search by salt, brand or device name."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {departments.map((dept) => (
          <article key={dept.href} className={`group flex min-h-[22rem] flex-col overflow-hidden rounded-[1.75rem] shadow-[0_18px_40px_rgba(18,32,51,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(18,32,51,0.16)] ${dept.theme}`}>
            <StorePhoto src={dept.photo} alt={dept.title} className="photo-sheen h-48" />
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-70">{dept.kicker}</p>
              <h3 className="font-display mt-2 text-2xl font-semibold">{dept.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed opacity-80">{dept.copy}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {dept.links.map(([label, href]) => (
                  <Link key={href + label} to={href} className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${dept.chip}`}>
                    {label}
                  </Link>
                ))}
              </div>
              <Link to={dept.href} className="mt-5 text-sm font-semibold underline-offset-4 hover:underline">
                Open {dept.title.toLowerCase()} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function QuickAisles() {
  const aisles = [
    { to: '/health-needs/pain-fever', icon: Thermometer, label: 'Pain & fever' },
    { to: '/health-needs/cold-flu', icon: Pill, label: 'Cold & flu' },
    { to: '/health-needs/first-aid', icon: ShieldCheck, label: 'First aid' },
    { to: '/surgical', icon: HeartPulse, label: 'BP & glucose' },
    { to: '/skin-care', icon: Sparkles, label: 'Skin care' },
    { to: '/cosmetics', icon: Sun, label: 'Sun care' },
    { to: '/mother-baby', icon: Baby, label: 'Mother & baby' },
    { to: '/vitamins-supplements', icon: Stethoscope, label: 'Vitamins' },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Jump to an aisle</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {aisles.map((aisle) => (
            <Link
              key={aisle.to}
              to={aisle.to}
              className="grid justify-items-center gap-2 rounded-2xl bg-mist px-3 py-5 text-center shadow-[0_6px_16px_rgba(18,32,51,0.04)] ring-1 ring-transparent transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_32px_rgba(0,167,212),0.1)] hover:ring-teal"
            >
              <aisle.icon className="size-5 text-teal" aria-hidden />
              <span className="text-sm font-semibold text-navy">{aisle.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: '01', title: 'Find the product', body: 'Search a salt name, a BP monitor, or a cleanser. The same catalog works with or without the API.' },
    { n: '02', title: 'Send a prescription if needed', body: 'Rx items stay out of a normal checkout until a pharmacist has reviewed a clear photo or PDF.' },
    { n: '03', title: 'Pay on collection or delivery', body: 'Cash on delivery and store pickup are first-class. Other methods appear only when the store confirms them.' },
    { n: '04', title: 'We confirm what we have', body: 'Availability is checked at the counter. We will not invent stock, a license number, or a delivery promise.' },
  ];
  return (
    <Section kicker="How the counter works" title="Shop like you would in person." tone="sand">
      <StorePhoto
        src={storePhotos.howItWorks}
        alt="Medicines and care products laid out the way a household actually uses them"
        className="photo-sheen mb-8 h-56 rounded-[1.75rem] shadow-[0_18px_40px_rgba(18,32,51,0.1)] md:h-72"
      />
      <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <StaggerItem key={step.n}>
            <div className="rounded-[1.4rem] bg-white p-6 shadow-[0_10px_28px_rgba(18,32,51,0.05)] ring-1 ring-line transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(18,32,51,0.1)]">
              <p className="font-display text-3xl text-teal">{step.n}</p>
              <h3 className="mt-3 font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

export function SpotlightAisles() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-6 lg:grid-cols-2">
      <Link to="/surgical" className="group overflow-hidden rounded-[1.75rem] bg-navy text-white shadow-[0_20px_44px_rgba(18,32,51,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(18,32,51,0.24)]">
        <StorePhoto src={storePhotos.surgical} alt="Home blood pressure monitor" className="photo-sheen h-56" />
        <div className="p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Before a clinic visit</p>
          <h3 className="font-display mt-2 text-3xl font-semibold">Home monitoring and surgical supplies</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            BP monitors, glucometers, pulse oximeters and consumables. Confirm the model at the counter if you need a
            specific cuff size or strip type.
          </p>
          <span className="mt-5 inline-block text-sm font-semibold text-mint transition group-hover:translate-x-1">Browse surgical →</span>
        </div>
      </Link>
      <Link to="/cosmetics" className="group overflow-hidden rounded-[1.75rem] bg-sand text-navy shadow-[0_20px_44px_rgba(18,32,51,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(18,32,51,0.16)]">
        <StorePhoto src={storePhotos.cosmetics} alt="Skin care creams and sun care on the counter" className="photo-sheen h-56" />
        <div className="p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal">Highland weather</p>
          <h3 className="font-display mt-2 text-3xl font-semibold">Skin care without the clinic voice</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
            Moisturisers, cleansers and sun care as labelled. Dry air and altitude are why people ask for them — not a
            reason for us to diagnose a skin condition.
          </p>
          <span className="mt-5 inline-block text-sm font-semibold text-teal transition group-hover:translate-x-1">Browse cosmetics →</span>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedMosaic() {
  const { data, isLoading } = useGetProductsQuery({ featured: true, limit: 7 });
  const items = data?.data ?? [];
  const lead = items[0];
  const rest = items.slice(1, 7);

  if (isLoading) {
    return <div className="grid h-96 animate-pulse gap-4 lg:grid-cols-3"><div className="rounded-3xl bg-white lg:col-span-2" /><div className="rounded-3xl bg-white" /></div>;
  }
  if (!lead) return <p className="text-sm text-ink/60">No featured products in this catalog.</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <LeadProduct product={lead} />
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
        {rest.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.slug}`}
            className="group flex gap-3 rounded-2xl bg-white p-3 shadow-[0_8px_20px_rgba(18,32,51,0.04)] ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-teal hover:shadow-[0_16px_32px_rgba(0,167,212),0.1)]"
          >
            <ProductArt kind={product.kind} name={product.name} src={product.images?.[0]?.url} className="size-20 shrink-0 rounded-xl" />
            <span className="min-w-0 py-1">
              <span className="line-clamp-2 font-semibold text-navy">{product.name}</span>
              <span className="mt-1 block text-sm text-ink/55">{product.packSize}</span>
              <span className="mt-1 block text-sm font-bold text-navy">{formatPrice(product.salePrice ?? product.price)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LeadProduct({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-[0_16px_36px_rgba(18,32,51,0.08)] ring-1 ring-line transition hover:-translate-y-1 hover:shadow-[0_26px_50px_rgba(18,32,51,0.14)]">
      <Link to={`/products/${product.slug}`} className="block">
        <ProductArt kind={product.kind} name={product.name} src={product.images?.[0]?.url} className="photo-sheen aspect-[5/3]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.prescriptionRequired ? <Badge tone="rx">Prescription review</Badge> : <Badge tone="teal">On the counter</Badge>}
        <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/65">{product.shortDescription}</p>
        <Button asChild className="mt-auto w-full" variant="navy">
          <Link to={`/products/${product.slug}`}>View product</Link>
        </Button>
      </div>
    </article>
  );
}

export function HealthNeedGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {healthNeeds.map((need) => (
        <Link
          key={need.id}
          to={`/health-needs/${need.slug}`}
          className="rounded-[1.3rem] bg-white p-5 shadow-[0_8px_20px_rgba(18,32,51,0.04)] ring-1 ring-line transition hover:-translate-y-1 hover:ring-teal hover:shadow-[0_18px_36px_rgba(0,167,212),0.1)]"
        >
          <p className="font-semibold text-navy">{need.name}</p>
          <p className="mt-1 text-sm text-ink/60">{need.description}</p>
        </Link>
      ))}
    </div>
  );
}

export function VisitBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid overflow-hidden rounded-[2rem] bg-teal text-white shadow-[0_28px_60px_rgba(0,167,212),0.28)] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-8 md:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Visit or enquire</p>
          <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold md:text-4xl">
            A local medical store — not a Gilgit checkbox on a Karachi warehouse.
          </h2>
          <p className="mt-4 max-w-xl text-white/80">
            Pickup from the counter is the option we can stand behind today. Delivery zones stay as drafts until the
            store confirms routes. Address, phone and hours below are placeholders until verified.
          </p>
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-mint">Address</dt>
              <dd className="mt-1">{storeSettings.address}</dd>
            </div>
            <div>
              <dt className="text-mint">Hours</dt>
              <dd className="mt-1">{storeSettings.openingHours}</dd>
            </div>
            <div>
              <dt className="text-mint">Phone</dt>
              <dd className="mt-1">{storeSettings.phone}</dd>
            </div>
            <div>
              <dt className="text-mint">WhatsApp</dt>
              <dd className="mt-1">{storeSettings.whatsapp}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-teal">
              <Link to="/delivery">Service area</Link>
            </Button>
            <Button
              type="button"
              variant="brass"
              onClick={() => {
                const url = whatsappUrl(
                  storeSettings.placeholders.whatsapp ? undefined : storeSettings.whatsapp,
                  `Hello ${storeSettings.shortName}, I have a product enquiry.`,
                );
                if (!url) {
                  toast.message('WhatsApp number is not published yet', {
                    description: 'A placeholder stays in store settings until the business confirms it.',
                  });
                  return;
                }
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
            >
              WhatsApp the store
            </Button>
          </div>
        </div>
        <div className="relative min-h-64">
          <StorePhoto src={storePhotos.visit} alt="Pharmacist at a medical store counter" className="h-full min-h-64" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-teal-deep/90 to-transparent p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Map</p>
              <p className="font-display mt-2 text-xl">Coordinates wait for a confirmed pin.</p>
              <p className="mt-2 text-sm text-white/75">Photo is illustrative. We will not drop a decorative map on an invented street.</p>
              <Link to="/contact" className="mt-4 inline-block text-sm font-semibold text-mint">
                Contact the counter →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TeamStrip() {
  const { data } = useGetTeamQuery();
  const members = data?.data ?? [];
  return (
    <Section
      kicker="The counter"
      title="Team"
      intro="Staff across medicines, equipment and skin care. The catalog listing still shows when the API is offline."
      action={{ to: '/team', label: 'Full team page' }}
      tone="white"
    >
      <TeamGrid members={members} />
    </Section>
  );
}

export function TrustStrip() {
  const points = [
    ['Authentic retail', 'Medicines and devices from regular supply channels — not a grey marketplace.'],
    ['Prescriptions stay private', 'Files go through the prescription form. WhatsApp is for product questions only.'],
    ['Honest NAP', 'Address, phone, hours and license stay marked as placeholders until the store confirms them.'],
    ['Three verticals, one counter', 'Useful when you are already in town for a clinic visit and need more than a tablet.'],
  ];
  return (
    <Section kicker="Why this counter" title="Quiet standards. No invented awards.">
      <div className="grid gap-4 md:grid-cols-2">
        {points.map(([title, body]) => (
          <div key={title} className="rounded-[1.4rem] border border-line bg-white p-6 shadow-[0_10px_24px_rgba(18,32,51,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(18,32,51,0.1)]">
            <h3 className="font-bold text-navy">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
