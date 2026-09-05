import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Seo } from '@/components/common/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { Hero } from '@/features/home/Hero';
import {
  DepartmentShowcase,
  FeaturedMosaic,
  HealthNeedGrid,
  HowItWorks,
  ProductRail,
  QuickAisles,
  Section,
  ServiceBar,
  SpotlightAisles,
  TeamStrip,
  TrustStrip,
  VisitBand,
} from '@/features/home/HomeSections';
import { faqs } from '@/data/deliveryZones';
import { storeSettings } from '@/data/storeSettings';
import { useGetBrandsQuery } from '@/store/api/catalogApi';
import { useGetBlogQuery, useGetDealsQuery, useGetReviewsQuery, useSubmitNewsletterMutation } from '@/store/api/storeApi';
import { blogCovers } from '@/data/storeImages';

export function HomePage() {
  const { data: brandsData } = useGetBrandsQuery();
  const { data: dealsData } = useGetDealsQuery();
  const { data: reviewsData } = useGetReviewsQuery();
  const { data: blogData } = useGetBlogQuery();
  const [subscribe, { isLoading }] = useSubmitNewsletterMutation();
  const featuredBrands = (brandsData?.data ?? []).filter((b) => b.featured).slice(0, 12);

  return (
    <>
      <Seo
        title={storeSettings.seo.title}
        description={storeSettings.seo.description}
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Pharmacy',
          name: storeSettings.name,
          description: storeSettings.description,
          areaServed: storeSettings.region,
        }}
      />
      <Hero />
      <ServiceBar />
      <DepartmentShowcase />
      <QuickAisles />

      <Section
        kicker="On the counter"
        title="Products people actually ask for"
        intro="Featured items from the catalog — medicines, devices and skin care together, the way the shop is laid out."
        action={{ to: '/deals', label: 'View marked deals' }}
        tone="white"
      >
        <FeaturedMosaic />
      </Section>

      <HowItWorks />

      <Section
        kicker="Pharmacy"
        title="Medicines"
        intro="Compare pack size, salt and brand. Prescription-only rows wait for a valid script."
        action={{ to: '/medicines', label: 'All medicines' }}
      >
        <ProductRail query={{ category: 'medicines', limit: 8 }} empty="No medicines listed." />
      </Section>

      <SpotlightAisles />

      <Section
        kicker="Devices"
        title="Surgical & medical equipment"
        intro="Home monitoring and clinic consumables. Ask at the counter if you need a specific cuff, strip or size."
        action={{ to: '/surgical', label: 'All equipment' }}
        tone="white"
      >
        <ProductRail query={{ category: 'surgical', limit: 8 }} empty="No equipment listed." />
      </Section>

      <Section
        kicker="Skin"
        title="Cosmetics & daily care"
        intro="Retail skin products as labelled. Not personal dermatology advice."
        action={{ to: '/cosmetics', label: 'All cosmetics' }}
      >
        <ProductRail query={{ category: 'cosmetics', limit: 8 }} empty="No cosmetics listed." />
      </Section>

      <Section
        kicker="Family"
        title="Mother & baby"
        intro="Diapers, baby care and pregnancy-related retail items. Speak with a clinician before starting a supplement."
        action={{ to: '/mother-baby', label: 'Shop the aisle' }}
        tone="white"
      >
        <ProductRail query={{ category: 'mother-baby', limit: 8 }} empty="No mother & baby products listed." />
      </Section>

      <Section
        kicker="Find care products"
        title="Shop by health need"
        intro="These links help you browse the catalog. They are not a diagnosis and they are not personal medical advice."
      >
        <HealthNeedGrid />
      </Section>

      <Section kicker="Familiar names" title="Brands on the shelf" action={{ to: '/brands', label: 'All brands' }} tone="white">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="flex min-h-24 flex-col items-center justify-center rounded-2xl bg-mist px-3 py-5 text-center shadow-[0_8px_18px_rgba(18,32,51,0.04)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_32px_rgba(0,167,212,0.1)] hover:ring-1 hover:ring-teal"
            >
              <span className="font-display text-lg font-semibold text-navy">{brand.logoText || brand.name}</span>
              <span className="mt-1 text-xs text-ink/50">{brand.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section kicker="Marked prices" title="Current deals">
        {(dealsData?.data ?? []).length === 0 ? (
          <p className="text-sm text-ink/60">
            No live promotions in this catalog.{' '}
            <Link to="/deals" className="font-semibold text-teal">
              See marked sale prices
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {(dealsData?.data ?? []).map((deal) => (
              <div key={deal.id} className="rounded-[1.4rem] bg-white p-6 shadow-[0_12px_28px_rgba(18,32,51,0.06)] ring-1 ring-line transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(18,32,51,0.12)]">
                <Badge tone="sale">{deal.badge || 'Deal'}</Badge>
                <h3 className="font-display mt-4 text-xl font-semibold text-navy">{deal.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{deal.description}</p>
                <Link to="/deals" className="mt-4 inline-block text-sm font-semibold text-teal">
                  See products →
                </Link>
              </div>
            ))}
          </div>
        )}
      </Section>

      <TrustStrip />
      <TeamStrip />
      <VisitBand />

      <Section kicker="Sample comments" title="What customers say" tone="white">
        <p className="mb-6 text-sm text-ink/55">Demo comments only — they are not used as review stars in search listings.</p>
        {(reviewsData?.data ?? []).length === 0 ? (
          <p className="text-sm text-ink/60">No sample comments in this catalog yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {(reviewsData?.data ?? []).map((review) => (
              <figure key={review.id} className="rounded-[1.4rem] bg-mist p-6 shadow-[0_8px_20px_rgba(18,32,51,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(18,32,51,0.08)]">
                <blockquote className="text-sm leading-relaxed text-ink/80">“{review.body}”</blockquote>
                <figcaption className="mt-4 text-xs font-semibold text-navy">{review.authorDisplay}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>

      <Section kicker="Read" title="Health guides" action={{ to: '/blog', label: 'All guides' }}>
        <div className="grid gap-4 md:grid-cols-3">
          {(blogData?.data ?? []).slice(0, 3).map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group overflow-hidden rounded-[1.4rem] bg-white shadow-[0_12px_28px_rgba(18,32,51,0.06)] ring-1 ring-line transition hover:-translate-y-1 hover:ring-teal hover:shadow-[0_22px_44px_rgba(0,167,212,0.12)]">
              <img src={blogCovers[post.slug] ?? '/images/aisle-medicines.jpg'} alt="" className="h-44 w-full object-cover" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-teal">{post.category}</p>
                <h3 className="font-display mt-2 text-xl font-semibold text-navy group-hover:text-teal">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{post.excerpt}</p>
                <p className="mt-4 text-xs text-ink/45">{post.readMinutes} min read</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section kicker="FAQ" title="Questions we hear at the counter" tone="white">
        <div className="divide-y divide-line overflow-hidden rounded-[1.4rem] bg-mist">
          {faqs.slice(0, 6).map((faq) => (
            <details key={faq.id} className="group px-6 py-4">
              <summary className="cursor-pointer list-none font-semibold text-navy marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span className="text-teal group-open:hidden">+</span>
                  <span className="hidden text-teal group-open:inline">–</span>
                </span>
              </summary>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/70">{faq.answer}</p>
            </details>
          ))}
        </div>
        <Link to="/faq" className="mt-4 inline-block text-sm font-semibold text-teal">
          All FAQs →
        </Link>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <form
          className="flex flex-col gap-6 rounded-[2rem] bg-navy px-8 py-10 text-white shadow-[0_28px_60px_rgba(18,32,51,0.28)] md:flex-row md:items-end md:px-12"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const email = String(new FormData(form).get('email') ?? '');
            try {
              await subscribe({ email }).unwrap();
              toast.success('You are on the store notes list.');
            } catch {
              toast.error('Could not subscribe. Check the email and try again.');
            }
            form.reset();
          }}
        >
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint">Store notes</p>
            <h2 className="font-display mt-2 text-3xl font-semibold">Openings, stock notes — not a diagnosis inbox.</h2>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              Occasional product and hours updates. Health questions belong on the prescription or contact form.
            </p>
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <Input id="newsletter-email" name="email" type="email" required className="mt-5 max-w-md border-white/20 bg-white text-ink" placeholder="you@email.com" />
          </div>
          <Button type="submit" disabled={isLoading} variant="brass" size="lg">
            Keep me posted
          </Button>
        </form>
      </section>
    </>
  );
}
