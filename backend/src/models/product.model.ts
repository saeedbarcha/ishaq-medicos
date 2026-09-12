import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

const seoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    canonicalUrl: String,
    ogImage: String,
    indexable: { type: Boolean, default: true },
  },
  { _id: false },
);

export interface IProduct {
  catalogId?: string;
  name: string;
  slug: string;
  shortName?: string;
  shortDescription: string;
  description: string;
  kind: string;
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
  images: Array<{ url: string; alt: string }>;
  price: number;
  salePrice?: number;
  costPrice?: number;
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
  attributes: Map<string, string> | Record<string, string>;
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
  seo: Record<string, unknown>;
  relatedProductIds: string[];
}

interface ProductModel extends mongoose.Model<IProduct> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IProduct>>;
}

const productSchema = new mongoose.Schema<IProduct, ProductModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    catalogId: { type: String, unique: true, sparse: true, index: true },
    shortName: String,
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    kind: {
      type: String,
      enum: ['medicine', 'surgical', 'cosmetic', 'personal-care', 'mother-baby', 'supplement'],
      required: true,
      index: true,
    },
    brandId: { type: String, default: '', index: true },
    manufacturerId: { type: String, default: '' },
    categoryId: { type: String, required: true, index: true },
    subcategoryId: String,
    genericName: String,
    saltName: String,
    strength: String,
    dosageForm: String,
    packSize: { type: String, default: '' },
    sku: { type: String, required: true, unique: true },
    barcode: String,
    images: [{ url: String, alt: String }],
    price: { type: Number, required: true, min: 0 },
    salePrice: Number,
    costPrice: { type: Number, private: true },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    prescriptionRequired: { type: Boolean, default: false },
    controlledMedicine: { type: Boolean, default: false },
    requiresPharmacistApproval: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
    tags: [String],
    searchKeywords: [String],
    healthNeeds: [String],
    attributes: { type: Map, of: String },
    storage: String,
    warnings: [String],
    model: String,
    material: String,
    dimensions: String,
    technicalSpecs: { type: Map, of: String },
    warranty: String,
    countryOfOrigin: String,
    accessoriesIncluded: [String],
    certifications: [String],
    skinType: [String],
    concerns: [String],
    ingredients: String,
    keyIngredients: [String],
    benefits: [String],
    directions: String,
    seo: { type: seoSchema, default: () => ({}) },
    relatedProductIds: [String],
  },
  { timestamps: true },
);

productSchema.index({
  name: 'text',
  genericName: 'text',
  saltName: 'text',
  sku: 'text',
  searchKeywords: 'text',
  shortDescription: 'text',
});

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

export const Product = mongoose.model<IProduct, ProductModel>('Product', productSchema);
