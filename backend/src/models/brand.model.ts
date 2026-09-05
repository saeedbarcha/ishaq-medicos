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

export interface IBrand {
  catalogId?: string;
  name: string;
  slug: string;
  description: string;
  origin?: string;
  featured: boolean;
  logoText: string;
  seo: Record<string, unknown>;
  active: boolean;
}

interface BrandModel extends mongoose.Model<IBrand> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IBrand>>;
}

const brandSchema = new mongoose.Schema<IBrand, BrandModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    catalogId: { type: String, unique: true, sparse: true, index: true },
    description: { type: String, default: '' },
    origin: String,
    featured: { type: Boolean, default: false },
    logoText: { type: String, default: '' },
    seo: { type: seoSchema, default: () => ({}) },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

export const Brand = mongoose.model<IBrand, BrandModel>('Brand', brandSchema);
