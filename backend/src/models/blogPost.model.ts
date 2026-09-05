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

export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  relatedCategorySlugs: string[];
  relatedProductSlugs: string[];
  readMinutes: number;
  publishedAt: Date;
  reviewed: boolean;
  published: boolean;
  seo: Record<string, unknown>;
}

interface BlogModel extends mongoose.Model<IBlogPost> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IBlogPost>>;
}

const blogPostSchema = new mongoose.Schema<IBlogPost, BlogModel>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: String, default: 'general' },
    tags: [String],
    relatedCategorySlugs: [String],
    relatedProductSlugs: [String],
    readMinutes: { type: Number, default: 4 },
    publishedAt: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true },
);

blogPostSchema.plugin(toJSON);
blogPostSchema.plugin(paginate);

export const BlogPost = mongoose.model<IBlogPost, BlogModel>('BlogPost', blogPostSchema);
