import type { DemoUser } from '@shared/types';
import { storePhotos } from './storeImages';

/**
 * Catalog staff for the public team page (same idea as local products).
 * These are sample counter roles so the storefront is complete without the API.
 * They are not a published employment roster.
 */
export const demoStaff: DemoUser[] = [
  {
    id: 'user-pharm',
    name: 'Amina Karim',
    email: 'pharmacist@ishaq.local',
    phone: '03XX-XXXXXXX',
    role: 'pharmacist',
    jobTitle: 'Pharmacist',
    bio: 'Reviews prescription photos and answers pack-size and salt-name questions at the medicines counter.',
    photoUrl: storePhotos.visit,
    showOnWebsite: true,
    sortOrder: 1,
    active: true,
  },
  {
    id: 'user-counter',
    name: 'Hassan Ali',
    email: 'counter@ishaq.local',
    phone: '03XX-XXXXXXX',
    role: 'staff',
    jobTitle: 'Counter staff',
    bio: 'Helps locate OTC packs, checks stock on the shelf, and prepares pickup orders.',
    photoUrl: storePhotos.medicines,
    showOnWebsite: true,
    sortOrder: 2,
    active: true,
  },
  {
    id: 'user-surgical',
    name: 'Sara Baig',
    email: 'surgical@ishaq.local',
    phone: '03XX-XXXXXXX',
    role: 'staff',
    jobTitle: 'Surgical & equipment',
    bio: 'Walks customers through BP monitors, glucometers, mobility aids and clinic consumables.',
    photoUrl: storePhotos.surgical,
    showOnWebsite: true,
    sortOrder: 3,
    active: true,
  },
  {
    id: 'user-skin',
    name: 'Mehwish Noor',
    email: 'cosmetics@ishaq.local',
    phone: '03XX-XXXXXXX',
    role: 'staff',
    jobTitle: 'Cosmetics & skin care',
    bio: 'Points people to labelled cleansers, moisturisers and sun care — retail advice, not a clinic consult.',
    photoUrl: storePhotos.cosmetics,
    showOnWebsite: true,
    sortOrder: 4,
    active: true,
  },
  {
    id: 'user-manager',
    name: 'Farhan Iqbal',
    email: 'manager@ishaq.local',
    phone: '03XX-XXXXXXX',
    role: 'manager',
    jobTitle: 'Store manager',
    bio: 'Coordinates the three aisles — medicines, equipment and skin care — and store pickup.',
    photoUrl: storePhotos.howItWorks,
    showOnWebsite: true,
    sortOrder: 5,
    active: true,
  },
];
