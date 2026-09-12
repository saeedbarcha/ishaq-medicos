import type { Brand, Manufacturer } from '../../../shared/types';

const seo = (name: string): Brand['seo'] => ({
  title: `${name} Products in Gilgit | Ishaq Medical`,
  description: `Shop ${name} products at Ishaq Medical, Surgical & Cosmetics in Gilgit-Baltistan.`,
  indexable: true,
});

export const brands: Brand[] = [
  { id: 'br-gsk', name: 'GSK', slug: 'gsk', description: 'Consumer healthcare and pharmaceutical products.', origin: 'United Kingdom', featured: true, logoText: 'GSK', seo: seo('GSK') },
  { id: 'br-panadol', name: 'Panadol', slug: 'panadol', description: 'Paracetamol pain and fever care brand.', featured: true, logoText: 'Panadol', seo: seo('Panadol') },
  { id: 'br-calpol', name: 'Calpol', slug: 'calpol', description: 'Paediatric paracetamol brand.', featured: true, logoText: 'Calpol', seo: seo('Calpol') },
  { id: 'br-getz', name: 'Getz Pharma', slug: 'getz-pharma', description: 'Pakistan-based pharmaceutical manufacturer.', origin: 'Pakistan', featured: true, logoText: 'Getz', seo: seo('Getz Pharma') },
  { id: 'br-abbott', name: 'Abbott', slug: 'abbott', description: 'Healthcare and nutrition products.', featured: true, logoText: 'Abbott', seo: seo('Abbott') },
  { id: 'br-pfizer', name: 'Pfizer', slug: 'pfizer', description: 'Pharmaceutical products.', featured: false, logoText: 'Pfizer', seo: seo('Pfizer') },
  { id: 'br-searle', name: 'Searle', slug: 'searle', description: 'Pakistani pharmaceutical company.', origin: 'Pakistan', featured: true, logoText: 'Searle', seo: seo('Searle') },
  { id: 'br-hilton', name: 'Hilton Pharma', slug: 'hilton-pharma', description: 'Pakistani pharmaceutical company.', origin: 'Pakistan', featured: false, logoText: 'Hilton', seo: seo('Hilton Pharma') },
  { id: 'br-omron', name: 'Omron', slug: 'omron', description: 'Home healthcare monitoring devices.', origin: 'Japan', featured: true, logoText: 'Omron', seo: seo('Omron') },
  { id: 'br-accu', name: 'Accu-Chek', slug: 'accu-chek', description: 'Blood glucose monitoring.', origin: 'Germany', featured: true, logoText: 'Accu-Chek', seo: seo('Accu-Chek') },
  { id: 'br-beurer', name: 'Beurer', slug: 'beurer', description: 'Health and well-being devices.', origin: 'Germany', featured: true, logoText: 'Beurer', seo: seo('Beurer') },
  { id: 'br-microlife', name: 'Microlife', slug: 'microlife', description: 'Diagnostic devices.', featured: false, logoText: 'Microlife', seo: seo('Microlife') },
  { id: 'br-neutrogena', name: 'Neutrogena', slug: 'neutrogena', description: 'Dermatologist-tested skin care.', featured: true, logoText: 'Neutrogena', seo: seo('Neutrogena') },
  { id: 'br-cetaphil', name: 'Cetaphil', slug: 'cetaphil', description: 'Gentle skin care.', featured: true, logoText: 'Cetaphil', seo: seo('Cetaphil') },
  { id: 'br-himalaya', name: 'Himalaya', slug: 'himalaya', description: 'Wellness and personal care.', origin: 'India', featured: true, logoText: 'Himalaya', seo: seo('Himalaya') },
  { id: 'br-nivea', name: 'Nivea', slug: 'nivea', description: 'Skin and body care.', origin: 'Germany', featured: true, logoText: 'Nivea', seo: seo('Nivea') },
  { id: 'br-bioderma', name: 'Bioderma', slug: 'bioderma', description: 'Dermo-cosmetic skin care.', origin: 'France', featured: true, logoText: 'Bioderma', seo: seo('Bioderma') },
  { id: 'br-vaseline', name: 'Vaseline', slug: 'vaseline', description: 'Moisturizing body care.', featured: false, logoText: 'Vaseline', seo: seo('Vaseline') },
  { id: 'br-colgate', name: 'Colgate', slug: 'colgate', description: 'Oral care.', featured: false, logoText: 'Colgate', seo: seo('Colgate') },
  { id: 'br-sensodyne', name: 'Sensodyne', slug: 'sensodyne', description: 'Sensitivity oral care.', featured: false, logoText: 'Sensodyne', seo: seo('Sensodyne') },
  { id: 'br-dettol', name: 'Dettol', slug: 'dettol', description: 'Hygiene and antiseptic products.', featured: true, logoText: 'Dettol', seo: seo('Dettol') },
  { id: 'br-pampers', name: 'Pampers', slug: 'pampers', description: 'Baby diapers and care.', featured: true, logoText: 'Pampers', seo: seo('Pampers') },
  { id: 'br-johnson', name: "Johnson's", slug: 'johnsons', description: 'Baby care products.', featured: true, logoText: "Johnson's", seo: seo("Johnson's") },
  { id: 'br-molty', name: 'Molty', slug: 'molty', description: 'Baby care products available in Pakistan.', origin: 'Pakistan', featured: false, logoText: 'Molty', seo: seo('Molty') },
  { id: 'br-centrum', name: 'Centrum', slug: 'centrum', description: 'Multivitamin supplements.', featured: true, logoText: 'Centrum', seo: seo('Centrum') },
  { id: 'br-osaka', name: 'Osaka', slug: 'osaka', description: 'Surgical disposables and supplies.', featured: false, logoText: 'Osaka', seo: seo('Osaka') },
  { id: 'br-medisana', name: 'Medisana', slug: 'medisana', description: 'Home health devices.', featured: false, logoText: 'Medisana', seo: seo('Medisana') },
];

export const manufacturers: Manufacturer[] = [
  { id: 'mf-gsk', name: 'GlaxoSmithKline', slug: 'gsk', country: 'United Kingdom' },
  { id: 'mf-getz', name: 'Getz Pharma', slug: 'getz-pharma', country: 'Pakistan' },
  { id: 'mf-searle', name: 'The Searle Company', slug: 'searle', country: 'Pakistan' },
  { id: 'mf-abbott', name: 'Abbott Laboratories', slug: 'abbott', country: 'USA' },
  { id: 'mf-omron', name: 'Omron Healthcare', slug: 'omron', country: 'Japan' },
  { id: 'mf-roche', name: 'Roche Diabetes Care', slug: 'roche', country: 'Switzerland' },
  { id: 'mf-beurer', name: 'Beurer GmbH', slug: 'beurer', country: 'Germany' },
  { id: 'mf-jnj', name: 'Johnson & Johnson', slug: 'johnson-johnson', country: 'USA' },
  { id: 'mf-galderma', name: 'Galderma', slug: 'galderma', country: 'Switzerland' },
  { id: 'mf-naos', name: 'NAOS', slug: 'naos', country: 'France' },
  { id: 'mf-unilever', name: 'Unilever', slug: 'unilever', country: 'UK' },
  { id: 'mf-pg', name: 'Procter & Gamble', slug: 'pg', country: 'USA' },
  { id: 'mf-himalaya', name: 'Himalaya Wellness', slug: 'himalaya', country: 'India' },
  { id: 'mf-reckitt', name: 'Reckitt', slug: 'reckitt', country: 'UK' },
  { id: 'mf-local-surgical', name: 'Imported / distributed surgical lines', slug: 'distributed-surgical' },
  { id: 'mf-pfizer', name: 'Pfizer', slug: 'pfizer', country: 'USA' },
];

export function getBrandById(id: string) {
  return brands.find((b) => b.id === id || b.slug === id);
}

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function getManufacturerById(id: string) {
  return manufacturers.find((m) => m.id === id || m.slug === id);
}
