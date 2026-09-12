import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { storeSettings } from '@/data/storeSettings';

const cols = [
  {
    title: 'Shop',
    links: [
      ['Medicines', '/medicines'],
      ['OTC & health needs', '/otc'],
      ['Surgical & equipment', '/surgical'],
      ['Cosmetics & skin care', '/cosmetics'],
      ['Mother & baby', '/mother-baby'],
      ['Vitamins', '/vitamins-supplements'],
    ],
  },
  {
    title: 'Help',
    links: [
      ['Upload prescription', '/prescription'],
      ['Delivery', '/delivery'],
      ['Track order', '/track-order'],
      ['FAQs', '/faq'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'The store',
    links: [
      ['About us', '/about'],
      ['Team', '/team'],
      ['Health guides', '/blog'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['Returns', '/returns'],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 bg-navy text-white">
      <div className="mountain-rule bg-[length:100%_10px] opacity-30" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5">
        <div className="md:col-span-2">
          <Logo onDark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{storeSettings.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            {storeSettings.region}
            <br />
            {storeSettings.address}
            <br />
            {storeSettings.phone}
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-mint ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Ask the counter
          </Link>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">{col.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link className="transition hover:translate-x-0.5 hover:text-white" to={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {storeSettings.name}. Demo catalog for development — not a live inventory feed.
      </div>
    </footer>
  );
}
