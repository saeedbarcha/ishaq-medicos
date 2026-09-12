import type { DeliveryZone, FaqItem } from '../../../shared/types';

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'dz-gilgit',
    name: 'Gilgit city',
    district: 'Gilgit',
    areas: ['Jutial', 'Airport Road', 'City market', '[Additional areas to be confirmed]'],
    estimatedDays: '[Delivery timing to be confirmed]',
    notes: 'Local delivery coverage and fees will be published here once confirmed by the store. Store pickup will remain available.',
    active: true,
  },
  {
    id: 'dz-nagir-hunza',
    name: 'Hunza & nearby',
    district: 'Hunza',
    areas: ['[Areas to be confirmed]'],
    estimatedDays: '[To be confirmed]',
    notes: 'Inter-district delivery is not promised until the store confirms routes and courier partners.',
    active: false,
  },
  {
    id: 'dz-skardu',
    name: 'Skardu & Baltistan',
    district: 'Skardu',
    areas: ['[Areas to be confirmed]'],
    estimatedDays: '[To be confirmed]',
    notes: 'Placeholder zone. Do not treat as a live delivery promise.',
    active: false,
  },
];

export const faqs: FaqItem[] = [
  {
    id: 'faq-rx',
    group: 'prescription',
    question: 'How do I order a prescription medicine?',
    answer:
      'Open Upload prescription, add your name, phone and notes, then send on WhatsApp. The chat opens with those titles and your answers already filled. Attach the photo or PDF in that chat. We will not dispense prescription-only items without pharmacist review.',
  },
  {
    id: 'faq-otc',
    group: 'ordering',
    question: 'Can I buy without an account?',
    answer: 'Yes. Guest checkout is available for items that do not require prescription review.',
  },
  {
    id: 'faq-pay',
    group: 'ordering',
    question: 'Which payment methods do you accept?',
    answer:
      'The checkout is built for cash on delivery, store pickup, bank transfer, JazzCash and Easypaisa. Live payment rails are connected only when the store enables them. Demo checkout never takes real money.',
  },
  {
    id: 'faq-delivery',
    group: 'delivery',
    question: 'Do you deliver across Gilgit-Baltistan?',
    answer:
      'We serve Gilgit-Baltistan as a local medical store. Exact delivery areas, fees and timings are placeholders until the store confirms them. You can also choose store pickup.',
  },
  {
    id: 'faq-genuine',
    group: 'products',
    question: 'Are products authentic?',
    answer:
      'Ishaq Medical is a retail medical store. We source through regular pharmaceutical and device supply channels. If a batch, expiry or pack looks incorrect, contact us before use.',
  },
  {
    id: 'faq-advice',
    group: 'products',
    question: 'Can this website diagnose me?',
    answer:
      'No. Category pages and health-need filters are for finding products, not for diagnosis or personal treatment plans. Follow your clinician and the product leaflet.',
  },
  {
    id: 'faq-whatsapp',
    group: 'ordering',
    question: 'Can I enquire on WhatsApp?',
    answer:
      'Yes. Product questions can use the WhatsApp button. Prescriptions should go through Upload prescription, which opens WhatsApp with your form titles and answers ready to send.',
  },
  {
    id: 'faq-return',
    group: 'ordering',
    question: 'Can medicines be returned?',
    answer:
      'Opened medicines and cold-chain items usually cannot be returned. Device returns follow the manufacturer and store policy once that policy is published.',
  },
];
