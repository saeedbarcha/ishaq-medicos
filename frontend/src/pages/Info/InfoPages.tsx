import { Link, useParams } from 'react-router-dom';
import { Seo } from '@/components/common/Seo';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { blogPosts, getPostBySlug } from '@/data/blogPosts';
import { blogCovers } from '@/data/storeImages';
import { deliveryZones, faqs } from '@/data/deliveryZones';
import { storeSettings } from '@/data/storeSettings';
import { TeamGrid } from '@/features/team/TeamGrid';
import { useSubmitContactMutation, useGetTeamQuery } from '@/store/api/storeApi';
import { toast } from 'sonner';

export function AboutPage() {
  const { data } = useGetTeamQuery();
  const team = data?.data ?? [];
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Seo title="About us | Ishaq Medical" description="Ishaq Medical, Surgical & Cosmetics is a healthcare retail store in Gilgit-Baltistan." path="/about" />
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">The store</p>
        <h1 className="font-display mt-2 text-4xl font-semibold text-navy">About Ishaq Medical</h1>
        <p className="mt-4 text-ink/75">{storeSettings.description}</p>
        <p className="mt-4 text-ink/75">
          We have not published a founding story or awards here. Those belong on this page only after the business supplies them.
        </p>
        <h2 className="mt-8 text-xl font-bold">What we offer</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/75">
          <li>Medicines — OTC shopping and prescription review</li>
          <li>Surgical and medical equipment for homes and clinics</li>
          <li>Cosmetics, skin care and personal care</li>
        </ul>
      </div>
      <section className="mt-14">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">People at the counter</p>
        <h2 className="font-display mt-2 text-3xl font-semibold text-navy">Team</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Medicines, equipment and skin-care counters. Login emails stay off this page.
        </p>
        <div className="mt-6">
          <TeamGrid members={team} />
        </div>
      </section>
      <Button asChild className="mt-10">
        <Link to="/contact">Contact the store</Link>
      </Button>
    </div>
  );
}

export function ContactPage() {
  const [send] = useSubmitContactMutation();
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-2">
      <Seo title="Contact | Ishaq Medical Gilgit" description="Contact Ishaq Medical, Surgical & Cosmetics in Gilgit-Baltistan." path="/contact" />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Gilgit-Baltistan</p>
        <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Contact</h1>
        <dl className="mt-6 space-y-3 text-sm">
          <div><dt className="text-ink/45">Address</dt><dd>{storeSettings.address}</dd></div>
          <div><dt className="text-ink/45">Phone</dt><dd>{storeSettings.phone}</dd></div>
          <div><dt className="text-ink/45">WhatsApp</dt><dd>{storeSettings.whatsapp}</dd></div>
          <div><dt className="text-ink/45">Email</dt><dd>{storeSettings.email}</dd></div>
          <div><dt className="text-ink/45">Hours</dt><dd>{storeSettings.openingHours}</dd></div>
        </dl>
        <p className="mt-4 text-sm text-ink/55">Map embed waits for confirmed coordinates. Fields marked as placeholders are not live NAP.</p>
      </div>
      <form
        className="space-y-3 rounded-[1.5rem] bg-white p-6 shadow-[0_14px_36px_rgba(18,32,51,0.06)] ring-1 ring-line"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const data = {
            name: String(form.get('name') ?? ''),
            phone: String(form.get('phone') ?? ''),
            subject: String(form.get('topic') ?? ''),
            message: String(form.get('message') ?? ''),
          };
          try {
            await send(data).unwrap();
            toast.success('Enquiry sent. We will use the contact details on this form only.');
            e.currentTarget.reset();
          } catch {
            toast.error('Could not send the enquiry. Check the form and try again.');
          }
        }}
      >
        <div><Label htmlFor="c-name">Name</Label><Input id="c-name" name="name" required /></div>
        <div><Label htmlFor="c-phone">Phone</Label><Input id="c-phone" name="phone" required /></div>
        <div><Label htmlFor="c-topic">Topic</Label>
          <select name="topic" className="h-11 w-full rounded-xl border border-line px-3 text-sm">
            <option>Product availability</option>
            <option>Prescription</option>
            <option>Delivery</option>
            <option>Other</option>
          </select>
        </div>
        <div><Label htmlFor="c-msg">Message</Label><Textarea id="c-msg" name="message" required /></div>
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export function DeliveryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title="Medicine delivery in Gilgit | Ishaq Medical" description="Delivery and pickup information for Ishaq Medical in Gilgit-Baltistan. Areas are placeholders until confirmed." path="/delivery" />
      <h1 className="text-3xl font-extrabold text-navy">Delivery & pickup</h1>
      <p className="mt-4 text-ink/75">We will not promise timings we have not measured. Pickup from the counter is the reliable option until routes are confirmed.</p>
      <ul className="mt-6 space-y-4">
        {deliveryZones.map((zone) => (
          <li key={zone.id} className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <p className="font-bold text-navy">{zone.name}</p>
            <p className="text-sm text-ink/65">{zone.notes}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-teal">{zone.active ? 'Draft zone' : 'Not active'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Seo title="Health guides | Ishaq Medical" description="Educational guides from Ishaq Medical. Not personal medical advice." path="/blog" />
      <h1 className="text-3xl font-extrabold text-navy">Health guides</h1>
      <p className="mt-3 text-ink/65">Reviewed educational notes. They are not a consultation.</p>
      <div className="mt-8 grid gap-4">
        {blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="overflow-hidden rounded-2xl bg-white ring-1 ring-line hover:ring-teal">
            <img src={blogCovers[post.slug] ?? '/images/aisle-medicines.jpg'} alt="" className="h-40 w-full object-cover" />
            <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-teal">{post.category}</p>
            <h2 className="mt-1 text-xl font-bold text-navy">{post.title}</h2>
            <p className="mt-2 text-sm text-ink/65">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <p className="p-8">Article not found.</p>;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={post.seo.title} description={post.seo.description} path={`/blog/${post.slug}`} jsonLd={{ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.publishedAt }} />
      <p className="text-xs font-bold uppercase tracking-wider text-teal">{post.category}</p>
      <h1 className="mt-2 text-3xl font-extrabold text-navy">{post.title}</h1>
      {blogCovers[post.slug] ? (
        <img src={blogCovers[post.slug]} alt="" className="mt-6 h-64 w-full rounded-[1.5rem] object-cover" />
      ) : null}
      <p className="mt-4 whitespace-pre-line text-ink/80">{post.content}</p>
    </article>
  );
}

export function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title="FAQs | Ishaq Medical" description="Ordering, prescriptions and delivery questions." path="/faq" jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }} />
      <h1 className="text-3xl font-extrabold text-navy">FAQs</h1>
      <div className="mt-6 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
        {faqs.map((faq) => (
          <details key={faq.id} className="px-5 py-4">
            <summary className="cursor-pointer font-semibold">{faq.question}</summary>
            <p className="mt-2 text-sm text-ink/70">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function Policy({ title, path, children }: { title: string; path: string; children: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={`${title} | Ishaq Medical`} description={title} path={path} />
      <h1 className="text-3xl font-extrabold text-navy">{title}</h1>
      <p className="mt-4 whitespace-pre-line text-ink/75">{children}</p>
    </div>
  );
}

export const PrivacyPage = () => (
  <Policy title="Privacy" path="/privacy">
    {`We collect contact details you type into forms. Prescription files are treated as sensitive and are not placed on public URLs.

Demo mode does not upload files or create a server-side mailing list.

Replace this notice with counsel-reviewed policy text before production.`}
  </Policy>
);

export const TermsPage = () => (
  <Policy title="Terms" path="/terms">
    {`The website is a retail catalog. It does not provide diagnosis or emergency care. Prescription medicines require review.

Prices in demo data are illustrative. Live prices are recalculated by the backend.`}
  </Policy>
);

export const ReturnsPage = () => (
  <Policy title="Returns" path="/returns">
    {`Opened medicines are generally not returnable. Device returns follow manufacturer and store policy once that policy is published.

This page is a placeholder until the store confirms its rules.`}
  </Policy>
);

export function TeamPage() {
  const { data, isLoading } = useGetTeamQuery();
  const team = data?.data ?? [];
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Seo
        title="Our team | Ishaq Medical"
        description="People at the Ishaq Medical counter in Gilgit-Baltistan — medicines, equipment and skin care."
        path="/team"
      />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">The counter</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">Team</h1>
      <p className="mt-3 max-w-2xl text-ink/65">
        Staff across the medicines, equipment and skin-care counters. This page uses the store catalog when the live
        roster is empty, so it still shows without the API.
      </p>
      <div className="mt-8">{isLoading ? <p className="text-sm text-ink/55">Loading team…</p> : <TeamGrid members={team} />}</div>
    </div>
  );
}

export function RouteErrorPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-navy">Something went wrong</h1>
      <p className="mt-3 text-ink/65">Refresh the page, or go back to the storefront.</p>
      <Button asChild className="mt-6">
        <Link to="/">Home</Link>
      </Button>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <Seo title="Page not found | Ishaq Medical" description="That page is not in this storefront." path="/404" noIndex />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">404</p>
      <h1 className="font-display mt-2 text-4xl font-semibold text-navy">This aisle is empty</h1>
      <p className="mt-3 text-ink/65">That URL is not a catalog page. Try search, or go back to the counter.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/medicines">Shop medicines</Link>
        </Button>
      </div>
    </div>
  );
}
