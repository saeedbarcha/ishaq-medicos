import type { BlogPost } from '../../../shared/types';

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'using-medicines-safely-at-home',
    title: 'Using medicines safely at home',
    excerpt: 'Simple habits for storing, checking and taking medicines — without turning this into a treatment guide.',
    content: `Keep medicines in the original pack, away from heat and children. Check the expiry date before use. Do not share prescription medicines.

If two packs contain the same salt name, they are not automatically interchangeable — pack strength and dosage form still matter. Ask a pharmacist at Ishaq Medical if you are unsure.

This guide is educational. It is not personal medical advice.`,
    category: 'Medicine safety',
    tags: ['safety', 'home'],
    relatedCategorySlugs: ['medicines', 'otc'],
    relatedProductSlugs: ['panadol-500mg-tablets'],
    readMinutes: 4,
    publishedAt: '2026-04-10T00:00:00.000Z',
    reviewed: true,
    seo: {
      title: 'Using Medicines Safely at Home | Ishaq Medical',
      description: 'Practical medicine-safety habits for households in Gilgit-Baltistan. Educational content, not personal medical advice.',
      indexable: true,
    },
  },
  {
    id: 'blog-2',
    slug: 'how-to-upload-a-prescription',
    title: 'How to upload a prescription',
    excerpt: 'What we need on a prescription photo so a pharmacist can review it without delay.',
    content: `Take the photo in daylight, on a flat surface. Include the whole page — doctor name, patient name, date, and medicines.

Accepted files: JPG, JPEG, PNG and PDF. Use Upload prescription so WhatsApp opens with your name, phone, email, file name and notes already filled. Attach the file in that same chat.

In demo mode, the file stays on your device until you attach it in WhatsApp.`,
    category: 'Prescriptions',
    tags: ['prescription', 'ordering'],
    relatedCategorySlugs: ['medicines'],
    relatedProductSlugs: [],
    readMinutes: 3,
    publishedAt: '2026-04-18T00:00:00.000Z',
    reviewed: true,
    seo: {
      title: 'How to Upload a Prescription | Ishaq Medical',
      description: 'How to submit a clear prescription photo or PDF to Ishaq Medical in Gilgit-Baltistan.',
      indexable: true,
    },
  },
  {
    id: 'blog-3',
    slug: 'building-a-home-first-aid-kit',
    title: 'Building a home first-aid kit',
    excerpt: 'A practical kit list for households and travel in Gilgit-Baltistan.',
    content: `A useful kit includes sterile gauze, crepe bandage, antiseptic, gloves, a digital thermometer, and any personal medicines you already use.

This is a packing list, not an emergency protocol. For serious injury, seek clinical care.`,
    category: 'First aid',
    tags: ['first-aid'],
    relatedCategorySlugs: ['first-aid', 'dressings'],
    relatedProductSlugs: ['sterile-gauze-pads', 'crepe-bandage-10cm'],
    readMinutes: 4,
    publishedAt: '2026-05-02T00:00:00.000Z',
    reviewed: true,
    seo: {
      title: 'Building a Home First-Aid Kit | Ishaq Medical',
      description: 'First-aid kit essentials available from Ishaq Medical in Gilgit.',
      indexable: true,
    },
  },
  {
    id: 'blog-4',
    slug: 'choosing-a-blood-pressure-monitor',
    title: 'Choosing a blood pressure monitor',
    excerpt: 'What to look at on a home BP monitor listing — cuff, power, and warranty fields.',
    content: `Prefer a listing that states cuff type (upper arm vs wrist), model number, and what is in the box. Wrist monitors are not automatically “wrong”, but upper-arm models are the usual home standard.

We cannot interpret your readings on this website. Follow the device manual and your clinician.`,
    category: 'Medical equipment',
    tags: ['devices', 'bp'],
    relatedCategorySlugs: ['blood-pressure-monitors', 'medical-equipment'],
    relatedProductSlugs: ['omron-hem-7120-bp-monitor'],
    readMinutes: 5,
    publishedAt: '2026-05-21T00:00:00.000Z',
    reviewed: true,
    seo: {
      title: 'Choosing a Blood Pressure Monitor | Ishaq Medical',
      description: 'A buying guide for home BP monitors sold at Ishaq Medical, Gilgit-Baltistan.',
      indexable: true,
    },
  },
  {
    id: 'blog-5',
    slug: 'gentle-skin-care-in-dry-mountain-weather',
    title: 'Gentle skin care in dry mountain weather',
    excerpt: 'Moisturizer, cleanser and sunscreen basics for a dry highland climate.',
    content: `Gilgit-Baltistan weather can be dry and bright. A gentle cleanser, a moisturizer that matches your labelled skin type, and sunscreen when you are outdoors are a simple routine.

We do not claim that any cream treats a disease. If you have a rash or a prescribed dermocosmetic, follow your clinician.`,
    category: 'Skin care',
    tags: ['skin', 'climate'],
    relatedCategorySlugs: ['skin-care', 'sun-protection'],
    relatedProductSlugs: ['cetaphil-moisturising-cream', 'neutrogena-ultra-sheer-spf-50'],
    readMinutes: 4,
    publishedAt: '2026-06-08T00:00:00.000Z',
    reviewed: true,
    seo: {
      title: 'Skin Care in Dry Mountain Weather | Ishaq Medical',
      description: 'Practical skin care notes for Gilgit-Baltistan, from Ishaq Medical.',
      indexable: true,
    },
  },
  {
    id: 'blog-6',
    slug: 'baby-care-essentials-for-home',
    title: 'Baby care essentials for home',
    excerpt: 'Diapers, lotion and fever-care products — and what this page will not tell you.',
    content: `Keep baby products in a cool, dry place. For fever or feeding concerns, contact a clinician. Calpol and similar products must be dosed from the pack by age/weight — this website will not calculate a dose.

This article is a shopping orientation, not paediatric advice.`,
    category: 'Baby care',
    tags: ['baby'],
    relatedCategorySlugs: ['mother-baby', 'baby-skin-care'],
    relatedProductSlugs: ['johnsons-baby-lotion', 'pampers-baby-dry-medium'],
    readMinutes: 3,
    publishedAt: '2026-06-20T00:00:00.000Z',
    reviewed: true,
    seo: {
      title: 'Baby Care Essentials | Ishaq Medical Gilgit',
      description: 'Mother and baby essentials at Ishaq Medical, Gilgit-Baltistan. Educational, not paediatric advice.',
      indexable: true,
    },
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
