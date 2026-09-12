import mongoose from 'mongoose';
import { config } from '../config/config.js';
import { User } from '../models/user.model.js';
import { Category } from '../models/category.model.js';
import { Brand } from '../models/brand.model.js';
import { Manufacturer } from '../models/manufacturer.model.js';
import { Product } from '../models/product.model.js';
import { StoreSettings } from '../models/storeSettings.model.js';
import { Banner } from '../models/banner.model.js';
import { Deal } from '../models/deal.model.js';
import { Faq } from '../models/faq.model.js';
import { BlogPost } from '../models/blogPost.model.js';
import { Review } from '../models/review.model.js';
import { DeliveryZone } from '../models/deliveryZone.model.js';
import { defaultStoreSettings } from './defaultStore.js';

const categories = [
  { catalogId: 'cat-medicines', name: 'Medicines', slug: 'medicines', navGroup: 'medicines', featured: true, description: 'Prescription and OTC medicines.' },
  { catalogId: 'cat-pain', name: 'Pain relief', slug: 'pain-relief', parentId: 'cat-medicines', navGroup: 'medicines', description: 'Analgesics and fever care as labelled.' },
  { catalogId: 'cat-otc', name: 'OTC & Health Needs', slug: 'otc', navGroup: 'medicines', featured: true, description: 'Everyday health products.' },
  { catalogId: 'cat-surgical', name: 'Surgical', slug: 'surgical', navGroup: 'surgical', featured: true, description: 'Surgical and clinic supplies.' },
  { catalogId: 'cat-bp', name: 'Blood pressure monitors', slug: 'blood-pressure-monitors', parentId: 'cat-surgical', navGroup: 'surgical', description: 'Home BP monitors.' },
  { catalogId: 'cat-cosmetics', name: 'Cosmetics', slug: 'cosmetics', navGroup: 'cosmetics', featured: true, description: 'Skin care and cosmetics.' },
  { catalogId: 'cat-face', name: 'Face care', slug: 'face-care', parentId: 'cat-cosmetics', navGroup: 'cosmetics', description: 'Cleansers and face care.' },
  { catalogId: 'cat-mother-baby', name: 'Mother & baby', slug: 'mother-baby', navGroup: 'cosmetics', featured: true, description: 'Baby and mother retail items.' },
  { catalogId: 'cat-vitamins', name: 'Vitamins & supplements', slug: 'vitamins-supplements', navGroup: 'vitamins', featured: true, description: 'Supplements as labelled.' },
];

const brands = [
  { catalogId: 'br-panadol', name: 'Panadol', slug: 'panadol', featured: true, logoText: 'Panadol' },
  { catalogId: 'br-omron', name: 'Omron', slug: 'omron', featured: true, logoText: 'Omron' },
  { catalogId: 'br-cetaphil', name: 'Cetaphil', slug: 'cetaphil', featured: true, logoText: 'Cetaphil' },
  { catalogId: 'br-himalaya', name: 'Himalaya', slug: 'himalaya', featured: true, logoText: 'Himalaya' },
  { catalogId: 'br-nivea', name: 'Nivea', slug: 'nivea', featured: true, logoText: 'Nivea' },
  { catalogId: 'br-pampers', name: 'Pampers', slug: 'pampers', featured: true, logoText: 'Pampers' },
  { catalogId: 'br-centrum', name: 'Centrum', slug: 'centrum', featured: true, logoText: 'Centrum' },
  { catalogId: 'br-generic-care', name: 'Generic care', slug: 'generic-care', logoText: 'GC' },
];

const products = [
  {
    catalogId: 'prd-panadol-500',
    name: 'Panadol 500mg Tablets',
    slug: 'panadol-500mg-tablets',
    shortDescription: 'Paracetamol 500mg tablets for pain and fever care as labelled.',
    kind: 'medicine',
    brandId: 'br-panadol',
    manufacturerId: 'mf-gsk',
    categoryId: 'cat-medicines',
    subcategoryId: 'cat-pain',
    genericName: 'Paracetamol',
    saltName: 'Paracetamol',
    packSize: '20 tablets',
    sku: 'MED-PND-500-20',
    price: 95,
    salePrice: 85,
    stock: 120,
    featured: true,
    healthNeeds: ['pain-fever'],
    searchKeywords: ['panadol', 'paracetamol'],
  },
  {
    catalogId: 'prd-omron-bp',
    name: 'Omron HEM-7120 Blood Pressure Monitor',
    slug: 'omron-hem-7120-bp-monitor',
    shortDescription: 'Upper-arm digital blood pressure monitor for home use.',
    kind: 'surgical',
    brandId: 'br-omron',
    manufacturerId: 'mf-omron',
    categoryId: 'cat-surgical',
    subcategoryId: 'cat-bp',
    packSize: '1 unit',
    sku: 'SUR-OMR-7120',
    price: 8950,
    salePrice: 8450,
    stock: 8,
    featured: true,
    searchKeywords: ['omron', 'bp', 'blood pressure'],
  },
  {
    catalogId: 'prd-cetaphil-cleanser',
    name: 'Cetaphil Gentle Skin Cleanser',
    slug: 'cetaphil-gentle-skin-cleanser',
    shortDescription: 'Soap-free cleanser for dry to normal skin as labelled.',
    kind: 'cosmetic',
    brandId: 'br-cetaphil',
    manufacturerId: 'mf-galderma',
    categoryId: 'cat-cosmetics',
    subcategoryId: 'cat-face',
    packSize: '250ml',
    sku: 'COS-CET-GSC-250',
    price: 1850,
    stock: 18,
    featured: true,
    healthNeeds: ['skin-care'],
    searchKeywords: ['cetaphil', 'cleanser'],
  },
  {
    catalogId: 'prd-himalaya-neem',
    name: 'Himalaya neem face wash',
    slug: 'himalaya-neem-face-wash',
    shortDescription: 'Neem face wash for daily cleansing. Not personal dermatology advice.',
    kind: 'cosmetic',
    brandId: 'br-himalaya',
    manufacturerId: 'mf-himalaya',
    categoryId: 'cat-cosmetics',
    subcategoryId: 'cat-face',
    packSize: '150 ml',
    sku: 'COS-HIM-NEEM-150',
    price: 420,
    stock: 35,
    featured: true,
    searchKeywords: ['neem', 'face wash'],
  },
  {
    catalogId: 'prd-gauze',
    name: 'Surgical gauze pack',
    slug: 'surgical-gauze-pack',
    shortDescription: 'Sterile gauze for clinic and home first-aid use as labelled.',
    kind: 'surgical',
    brandId: 'br-generic-care',
    manufacturerId: 'mf-local',
    categoryId: 'cat-surgical',
    packSize: '10 pieces',
    sku: 'SUR-GAUZE-10',
    price: 250,
    stock: 40,
    featured: true,
    healthNeeds: ['first-aid'],
    searchKeywords: ['gauze', 'surgical'],
  },
];

const banners = [
  { title: 'A medical store for Gilgit-Baltistan', subtitle: 'Medicines, surgical equipment and skin care — with pharmacist review for prescription items.', ctaLabel: 'Shop products', ctaHref: '/medicines', tone: 'teal', imageLabel: 'Store counter', imageUrl: '/images/hero-pharmacy.jpg', sortOrder: 1 },
  { title: 'Need a prescription medicine?', subtitle: 'Upload a photo or PDF. We review it privately before we prepare an order.', ctaLabel: 'Upload prescription', ctaHref: '/prescription', tone: 'navy', imageLabel: 'Prescription review', imageUrl: '/images/blog/prescription.jpg', sortOrder: 2 },
];

const deals = [
  { title: 'Everyday care picks', description: 'Selected OTC products with a marked sale price in the demo catalog.', productIds: ['prd-panadol-500'], badge: 'Value' },
  { title: 'Home monitoring', description: 'Selected devices currently listed with a promotional price.', productIds: ['prd-omron-bp'], badge: 'Devices' },
  { title: 'Skin essentials', description: 'Hydration and sun care for dry highland weather.', productIds: ['prd-cetaphil-cleanser'], badge: 'Skin' },
];

const faqs = [
  { question: 'How do I order a prescription medicine?', answer: 'Open Upload prescription, add your name and phone, attach a clear photo or PDF, and wait for pharmacist review.', group: 'prescription', sortOrder: 1 },
  { question: 'Can I buy without an account?', answer: 'Yes. Guest checkout is available for items that do not require prescription review.', group: 'ordering', sortOrder: 2 },
  { question: 'Do you deliver across Gilgit-Baltistan?', answer: 'Exact delivery areas are placeholders until the store confirms them. Store pickup remains available.', group: 'delivery', sortOrder: 3 },
];

const blogPosts = [
  { slug: 'using-medicines-safely-at-home', title: 'Using medicines safely at home', excerpt: 'Simple habits for storing, checking and taking medicines — without turning this into a treatment guide.', content: 'Keep medicines in the original pack, away from heat and children. This guide is educational. It is not personal medical advice.', category: 'Medicine safety', tags: ['safety'], relatedCategorySlugs: ['medicines'], relatedProductSlugs: ['panadol-500mg-tablets'], readMinutes: 4, reviewed: true, published: true },
  { slug: 'how-to-upload-a-prescription', title: 'How to upload a prescription', excerpt: 'What we need on a prescription photo so a pharmacist can review it without delay.', content: 'Take the photo in daylight, on a flat surface. Include the whole page.', category: 'Prescriptions', tags: ['prescription'], relatedCategorySlugs: ['medicines'], relatedProductSlugs: [], readMinutes: 3, reviewed: true, published: true },
  { slug: 'building-a-home-first-aid-kit', title: 'Building a home first-aid kit', excerpt: 'A practical kit list for households and travel in Gilgit-Baltistan.', content: 'A useful kit includes sterile gauze, crepe bandage, antiseptic, gloves and a digital thermometer. This is a packing list, not an emergency protocol.', category: 'First aid', tags: ['first-aid'], relatedCategorySlugs: ['first-aid'], relatedProductSlugs: ['surgical-gauze-pack'], readMinutes: 4, reviewed: true, published: true },
];

const reviews = [
  { productId: 'prd-omron-bp', authorDisplay: 'A.K., Gilgit (demo)', rating: 5, title: 'Clear instructions', body: 'Demo review for the catalog.', isDemo: true, approved: true },
  { productId: 'prd-cetaphil-cleanser', authorDisplay: 'S.M., Hunza (demo)', rating: 5, title: 'Gentle cleanser', body: 'Sample comment for demonstration.', isDemo: true, approved: true },
  { authorDisplay: 'Family caregiver, Skardu (demo)', rating: 4, title: 'Helpful on WhatsApp', body: 'Demo story only. Replace with real reviews when available.', isDemo: true, approved: true },
];

const zones = [
  { name: 'Gilgit city', district: 'Gilgit', areas: ['Jutial', 'Airport Road', 'City market'], estimatedDays: '[Delivery timing to be confirmed]', notes: 'Local delivery coverage will be published once confirmed. Store pickup remains available.', active: true },
];

async function seed() {
  await mongoose.connect(config.mongoose.url);

  if (!(await User.findOne({ email: config.admin.email }))) {
    await User.create({
      name: 'Ishaq Admin',
      email: config.admin.email,
      password: config.admin.password,
      role: 'superAdmin',
      isSuperAdmin: true,
      active: true,
      emailVerified: true,
    });
    console.log(`Created admin ${config.admin.email}`);
  }

  if (!(await StoreSettings.findOne())) {
    await StoreSettings.create(defaultStoreSettings);
  }

  for (const category of categories) {
    await Category.updateOne(
      { slug: category.slug },
      { $set: { ...category, intro: category.description, seoContent: '', icon: '', faqs: [], relatedCategoryIds: [], relatedBlogSlugs: [], seo: { title: category.name, description: category.description, indexable: true }, active: true } },
      { upsert: true },
    );
  }
  for (const brand of brands) {
    await Brand.updateOne(
      { slug: brand.slug },
      { $set: { ...brand, description: brand.name, seo: { title: brand.name, description: brand.name, indexable: true }, active: true } },
      { upsert: true },
    );
  }
  await Manufacturer.updateOne({ slug: 'gsk' }, { $setOnInsert: { name: 'GSK', slug: 'gsk', country: 'UK' } }, { upsert: true });
  await Manufacturer.updateOne({ slug: 'omron' }, { $setOnInsert: { name: 'Omron', slug: 'omron' } }, { upsert: true });
  await Manufacturer.updateOne({ slug: 'himalaya' }, { $setOnInsert: { name: 'Himalaya', slug: 'himalaya' } }, { upsert: true });
  await Manufacturer.updateOne({ slug: 'local' }, { $setOnInsert: { name: 'Local supply', slug: 'local' } }, { upsert: true });

  for (const product of products) {
    await Product.updateOne(
      { sku: product.sku },
      {
        $set: {
          ...product,
          description: product.shortDescription,
          lowStockThreshold: 5,
          images: [{ url: `/images/products/${product.kind}.jpg`, alt: product.name }],
          tags: product.searchKeywords,
          relatedProductIds: [],
          active: true,
          seo: { title: `${product.name} | Ishaq Medical`, description: product.shortDescription, indexable: true },
        },
      },
      { upsert: true },
    );
  }

  if ((await Banner.countDocuments()) === 0) {
    await Banner.insertMany(banners);
  }
  if ((await Deal.countDocuments()) === 0) {
    await Deal.insertMany(deals);
  }
  if ((await Faq.countDocuments()) === 0) {
    await Faq.insertMany(faqs);
  }
  for (const post of blogPosts) {
    await BlogPost.updateOne({ slug: post.slug }, { $setOnInsert: { ...post, publishedAt: new Date('2026-04-10') } }, { upsert: true });
  }
  if ((await Review.countDocuments()) === 0) {
    await Review.insertMany(reviews);
  }
  if ((await DeliveryZone.countDocuments()) === 0) {
    await DeliveryZone.insertMany(zones);
  }

  console.log(`Seed complete. ${products.length} catalog products upserted.`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
