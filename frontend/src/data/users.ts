import type { Address, AdminMetrics, DemoUser, InventoryBatch, Order, PrescriptionRequest } from '../../../shared/types';
import { demoStaff } from './team';

export const demoUsers: DemoUser[] = [
  { id: 'user-demo', name: 'Demo Customer', email: 'demo@ishaq.local', phone: '03XX-XXXXXXX', role: 'customer' },
  {
    id: 'user-admin',
    name: 'Demo Admin',
    email: 'admin@ishaq.local',
    phone: '03XX-XXXXXXX',
    role: 'admin',
    jobTitle: 'Store admin',
    showOnWebsite: false,
    active: true,
  },
  ...demoStaff,
];

export const demoAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Demo Customer',
    phone: '03XX-XXXXXXX',
    district: 'Gilgit',
    city: 'Gilgit',
    area: '[Area to be confirmed]',
    addressLine: '[Street address to be confirmed]',
    landmark: '[Landmark to be confirmed]',
    isDefault: true,
  },
];

export const demoOrders: Order[] = [
  {
    id: 'ord-1001',
    publicRef: 'IM-24018',
    accessToken: 'demo-track-7f3a',
    status: 'dispatched',
    items: [
      {
        productId: 'prd-panadol-500',
        name: 'Panadol 500mg Tablets',
        slug: 'panadol-500mg-tablets',
        packSize: '20 tablets',
        quantity: 2,
        unitPrice: 85,
        prescriptionRequired: false,
      },
      {
        productId: 'prd-ors',
        name: 'ORS Sachets',
        slug: 'ors-sachets',
        packSize: '20 sachets',
        quantity: 1,
        unitPrice: 160,
        prescriptionRequired: false,
      },
    ],
    subtotal: 330,
    discount: 0,
    deliveryFee: 0,
    total: 330,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    customerName: 'Demo Customer',
    phone: '03XX-XXXXXXX',
    addressSummary: 'Gilgit · [Address placeholder]',
    isDemo: true,
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-08-21T11:00:00.000Z',
  },
  {
    id: 'ord-1002',
    publicRef: 'IM-24019',
    accessToken: 'demo-track-9c21',
    status: 'prescription_review',
    items: [
      {
        productId: 'prd-risek',
        name: 'Risek 20mg Capsules',
        slug: 'risek-20mg-capsules',
        packSize: '14 capsules',
        quantity: 1,
        unitPrice: 280,
        prescriptionRequired: true,
      },
    ],
    subtotal: 280,
    discount: 0,
    deliveryFee: 0,
    total: 280,
    paymentMethod: 'store_pickup',
    paymentStatus: 'pending',
    customerName: 'Demo Customer',
    phone: '03XX-XXXXXXX',
    addressSummary: 'Store pickup · Gilgit',
    notes: 'Waiting on prescription review',
    isDemo: true,
    createdAt: '2026-08-22T14:00:00.000Z',
    updatedAt: '2026-08-22T14:10:00.000Z',
  },
];

export const demoPrescriptions: PrescriptionRequest[] = [
  {
    id: 'rx-501',
    name: 'Demo Customer',
    phone: '03XX-XXXXXXX',
    notes: 'Photo was clear. Demo record only.',
    status: 'under_review',
    fileName: 'prescription-demo.jpg',
    isDemo: true,
    createdAt: '2026-08-22T14:00:00.000Z',
  },
];

export const inventoryBatches: InventoryBatch[] = [
  {
    id: 'bat-1',
    productId: 'prd-panadol-500',
    batchNumber: 'PN-2601',
    quantity: 120,
    reservedQuantity: 4,
    expiryDate: '2027-11-01',
    purchaseDate: '2026-03-01',
    supplierReference: 'DEMO-SUP-01',
  },
  {
    id: 'bat-2',
    productId: 'prd-augmentin',
    batchNumber: 'AUG-2509',
    quantity: 18,
    reservedQuantity: 1,
    expiryDate: '2026-10-15',
    purchaseDate: '2026-04-01',
  },
  {
    id: 'bat-3',
    productId: 'prd-cetaphil-cleanser',
    batchNumber: 'CET-2604',
    quantity: 18,
    reservedQuantity: 0,
    expiryDate: '2028-01-01',
    purchaseDate: '2026-05-12',
  },
];

function demoSeries(): AdminMetrics['series'] {
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - index));
    const iso = date.toISOString().slice(0, 10);
    const wave = [3, 4, 2, 5, 6, 4, 7, 5, 3, 8, 6, 4, 5, 6][index];
    return {
      date: iso,
      label: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      orders: wave,
      sales: 2800 + wave * 2100 + (index % 3) * 400,
    };
  });
}

export const adminMetrics: AdminMetrics = {
  todaysOrders: 6,
  salesToday: 18420,
  orders7d: 31,
  sales7d: 91240,
  ordersPrev7d: 24,
  salesPrev7d: 74800,
  orders30d: 118,
  sales30d: 342600,
  ordersChange: 29,
  salesChange: 22,
  avgOrderValue: 2903,
  pendingOrders: 3,
  deliveredOrders: 86,
  cancelledOrders: 4,
  totalOrders: 122,
  prescriptionReviews: 2,
  lowStock: 4,
  outOfStock: 0,
  nearExpiry: 1,
  recentCustomers: 11,
  totalCustomers: 48,
  newInquiries: 2,
  catalogActive: 42,
  catalogTotal: 46,
  series: demoSeries(),
  ordersByStatus: [
    { status: 'delivered', count: 86 },
    { status: 'pending', count: 3 },
    { status: 'confirmed', count: 5 },
    { status: 'prescription_review', count: 2 },
    { status: 'cancelled', count: 4 },
  ],
  catalogByKind: [
    { kind: 'medicine', count: 18 },
    { kind: 'surgical', count: 9 },
    { kind: 'cosmetic', count: 8 },
    { kind: 'mother-baby', count: 5 },
    { kind: 'supplement', count: 2 },
  ],
  payments: [
    { method: 'store_pickup', count: 54, sales: 148200 },
    { method: 'cod', count: 41, sales: 126400 },
    { method: 'jazzcash', count: 15, sales: 41000 },
  ],
  popularProducts: [
    { name: 'Panadol 500mg', qty: 42, revenue: 12600 },
    { name: 'Omron BP monitor', qty: 11, revenue: 48400 },
    { name: 'Cetaphil cleanser', qty: 19, revenue: 17100 },
    { name: 'ORS sachets', qty: 28, revenue: 5600 },
  ],
  recentOrders: [
    { id: '1', publicRef: 'IM-24018', status: 'pending', total: 2140, customerName: 'Demo customer', paymentMethod: 'store_pickup' },
    { id: '2', publicRef: 'IM-24012', status: 'delivered', total: 8900, customerName: 'Counter pickup', paymentMethod: 'cod' },
  ],
  attention: [
    { name: 'Risek 20mg', sku: 'RSK-20', stock: 3, kind: 'medicine' },
    { name: 'Surgical gloves M', sku: 'GLV-M', stock: 4, kind: 'surgical' },
  ],
  popularProductIds: ['prd-panadol-500', 'prd-omron-bp', 'prd-cetaphil-cleanser', 'prd-ors'],
};

export const popularSearches = [
  'Panadol',
  'ORS',
  'BP monitor',
  'Glucometer',
  'Cetaphil',
  'Pampers',
  'Sunscreen',
  'Risek',
];
