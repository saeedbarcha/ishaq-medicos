import type { Banner, Deal } from '../../../shared/types';

export const banners: Banner[] = [
  {
    id: 'bn-hero-main',
    title: 'A medical store for Gilgit-Baltistan',
    subtitle: 'Medicines, surgical equipment and skin care — with pharmacist review for prescription items.',
    ctaLabel: 'Shop products',
    ctaHref: '/medicines',
    tone: 'teal',
    imageLabel: 'Store counter',
  },
  {
    id: 'bn-rx',
    title: 'Need a prescription medicine?',
    subtitle: 'Upload a photo or PDF. We review it privately before we prepare an order.',
    ctaLabel: 'Upload prescription',
    ctaHref: '/prescription',
    tone: 'navy',
    imageLabel: 'Prescription review',
  },
  {
    id: 'bn-surgical',
    title: 'Home healthcare equipment',
    subtitle: 'BP monitors, glucometers, mobility aids and clinic supplies.',
    ctaLabel: 'Browse equipment',
    ctaHref: '/surgical',
    tone: 'mint',
    imageLabel: 'BP monitor',
  },
];

export const deals: Deal[] = [
  {
    id: 'deal-otc',
    title: 'Everyday care picks',
    description: 'Selected OTC products with a marked sale price in the demo catalog.',
    productIds: ['prd-panadol-500', 'prd-ors', 'prd-nivea-soft'],
    badge: 'Value',
  },
  {
    id: 'deal-devices',
    title: 'Home monitoring',
    description: 'Selected devices currently listed with a promotional price.',
    productIds: ['prd-omron-bp', 'prd-pulse-ox'],
    badge: 'Devices',
  },
  {
    id: 'deal-skin',
    title: 'Skin essentials',
    description: 'Hydration and sun care for dry highland weather.',
    productIds: ['prd-neutrogena-hydro', 'prd-sunscreen', 'prd-cetaphil-cleanser'],
    badge: 'Skin',
  },
];
