export type DataSourceMode = 'local' | 'api' | 'auto';
export type DataSourceStatus = 'local' | 'api' | 'fallback' | 'unknown';

export type UserRole =
  | 'customer'
  | 'staff'
  | 'pharmacist'
  | 'manager'
  | 'admin'
  | 'superAdmin';

export type ProductKind =
  | 'medicine'
  | 'surgical'
  | 'cosmetic'
  | 'personal-care'
  | 'mother-baby'
  | 'supplement';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';

export type PrescriptionStatus =
  | 'received'
  | 'under_review'
  | 'needs_clarification'
  | 'approved'
  | 'unavailable'
  | 'ready_for_order'
  | 'completed';

export type OrderStatus =
  | 'pending'
  | 'prescription_review'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'cod'
  | 'store_pickup'
  | 'bank_transfer'
  | 'jazzcash'
  | 'easypaisa';

export type PaymentStatus = 'pending' | 'awaiting_proof' | 'paid' | 'failed' | 'refunded';

export interface SeoFields {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  indexable: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  intro: string;
  seoContent: string;
  icon: string;
  image?: string;
  productCount: number;
  featured: boolean;
  navGroup: 'medicines' | 'surgical' | 'cosmetics' | 'personal' | 'mother' | 'vitamins';
  seo: SeoFields;
  relatedCategoryIds: string[];
  relatedBlogSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin?: string;
  featured: boolean;
  logoText: string;
  seo: SeoFields;
}

export interface Manufacturer {
  id: string;
  name: string;
  slug: string;
  country?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  shortDescription: string;
  description: string;
  kind: ProductKind;
  brandId: string;
  manufacturerId: string;
  categoryId: string;
  subcategoryId?: string;
  genericName?: string;
  saltName?: string;
  strength?: string;
  dosageForm?: string;
  packSize: string;
  sku: string;
  barcode?: string;
  images: ProductImage[];
  price: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  prescriptionRequired: boolean;
  controlledMedicine: boolean;
  requiresPharmacistApproval: boolean;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  active: boolean;
  tags: string[];
  searchKeywords: string[];
  healthNeeds: string[];
  attributes: Record<string, string>;
  storage?: string;
  warnings?: string[];
  model?: string;
  material?: string;
  dimensions?: string;
  technicalSpecs?: Record<string, string>;
  warranty?: string;
  countryOfOrigin?: string;
  accessoriesIncluded?: string[];
  certifications?: string[];
  skinType?: string[];
  concerns?: string[];
  ingredients?: string;
  keyIngredients?: string[];
  benefits?: string[];
  directions?: string;
  seo: SeoFields;
  relatedProductIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminProduct extends Product {
  costPrice?: number;
}

export interface InventoryBatch {
  id: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  reservedQuantity: number;
  expiryDate: string;
  purchaseDate: string;
  supplierReference?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  tone: 'teal' | 'navy' | 'mint' | 'sand';
  imageLabel: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  badge: string;
  endsAt?: string;
}

export interface Review {
  id: string;
  productId?: string;
  authorDisplay: string;
  rating: number;
  title: string;
  body: string;
  isDemo: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  relatedCategorySlugs: string[];
  relatedProductSlugs: string[];
  readMinutes: number;
  publishedAt: string;
  reviewed: boolean;
  seo: SeoFields;
}

export interface DeliveryZone {
  id: string;
  name: string;
  district: string;
  areas: string[];
  estimatedDays: string;
  notes: string;
  active: boolean;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
}

export interface StoreSettings {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  region: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  mapEmbedUrl?: string;
  latitude?: number;
  longitude?: number;
  foundingYear?: string;
  licenseNumber?: string;
  pharmacistName?: string;
  social: SocialLinks;
  announcement: string;
  currency: 'PKR';
  currencySymbol: string;
  placeholders: {
    address: boolean;
    phone: boolean;
    whatsapp: boolean;
    email: boolean;
    hours: boolean;
    map: boolean;
    license: boolean;
    social: boolean;
  };
  seo: SeoFields;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  group: 'ordering' | 'prescription' | 'delivery' | 'products';
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  email?: string;
  district: string;
  city: string;
  area: string;
  addressLine: string;
  landmark?: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  prescriptionRequired: boolean;
}

export interface Order {
  id: string;
  publicRef: string;
  accessToken: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerName: string;
  phone: string;
  email?: string;
  addressSummary: string;
  notes?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: PrescriptionStatus;
  fileName?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  jobTitle?: string;
  bio?: string;
  photoUrl?: string;
  showOnWebsite?: boolean;
  sortOrder?: number;
  active?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string;
  photoUrl: string;
  role: UserRole;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface ProductQuery {
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  kind?: ProductKind;
  healthNeed?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  prescriptionRequired?: boolean;
  featured?: boolean;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'recent' | 'popular';
  id: string;
  label: string;
  href: string;
  meta?: string;
}

export interface AdminSeriesPoint {
  date: string;
  label: string;
  orders: number;
  sales: number;
}

export interface AdminMetrics {
  todaysOrders: number;
  salesToday: number;
  orders7d?: number;
  sales7d?: number;
  ordersPrev7d?: number;
  salesPrev7d?: number;
  orders30d?: number;
  sales30d?: number;
  ordersChange?: number;
  salesChange?: number;
  avgOrderValue?: number;
  pendingOrders: number;
  deliveredOrders?: number;
  cancelledOrders?: number;
  totalOrders?: number;
  prescriptionReviews: number;
  lowStock: number;
  outOfStock: number;
  nearExpiry: number;
  recentCustomers: number;
  totalCustomers?: number;
  newInquiries?: number;
  catalogActive?: number;
  catalogTotal?: number;
  series?: AdminSeriesPoint[];
  ordersByStatus?: Array<{ status: string; count: number }>;
  catalogByKind?: Array<{ kind: string; count: number }>;
  payments?: Array<{ method: string; count: number; sales: number }>;
  popularProducts?: Array<{ name: string; qty: number; revenue: number }>;
  recentOrders?: Array<{
    id: string;
    publicRef: string;
    status: string;
    total: number;
    customerName: string;
    paymentMethod: string;
    createdAt?: string | Date;
  }>;
  attention?: Array<{ name: string; sku?: string; stock: number; kind?: string }>;
  popularProductIds: string[];
}
