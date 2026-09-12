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

export interface ICategory {
  catalogId?: string;
  name: string;
  slug: string;
  parentId?: string | null;
  description: string;
  intro: string;
  seoContent: string;
  icon: string;
  image?: string;
  productCount: number;
  featured: boolean;
  navGroup: string;
  seo: Record<string, unknown>;
  relatedCategoryIds: string[];
  relatedBlogSlugs: string[];
  faqs: Array<{ question: string; answer: string }>;
  active: boolean;
}

interface CategoryModel extends mongoose.Model<ICategory> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<ICategory>>;
}

const categorySchema = new mongoose.Schema<ICategory, CategoryModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    catalogId: { type: String, unique: true, sparse: true, index: true },
    parentId: { type: String, default: null },
    description: { type: String, default: '' },
    intro: { type: String, default: '' },
    seoContent: { type: String, default: '' },
    icon: { type: String, default: '' },
    image: String,
    productCount: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    navGroup: {
      type: String,
      enum: ['medicines', 'surgical', 'cosmetics', 'personal', 'mother', 'vitamins'],
      default: 'medicines',
    },
    seo: { type: seoSchema, default: () => ({}) },
    relatedCategoryIds: [String],
    relatedBlogSlugs: [String],
    faqs: [{ question: String, answer: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

export const Category = mongoose.model<ICategory, CategoryModel>('Category', categorySchema);
