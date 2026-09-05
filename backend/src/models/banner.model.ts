import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IBanner {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  tone: string;
  imageLabel: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
}

interface BannerModel extends mongoose.Model<IBanner> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IBanner>>;
}

const bannerSchema = new mongoose.Schema<IBanner, BannerModel>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Shop now' },
    ctaHref: { type: String, default: '/medicines' },
    tone: { type: String, enum: ['teal', 'navy', 'mint', 'sand'], default: 'teal' },
    imageLabel: { type: String, default: '' },
    imageUrl: String,
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

bannerSchema.plugin(toJSON);
bannerSchema.plugin(paginate);

export const Banner = mongoose.model<IBanner, BannerModel>('Banner', bannerSchema);
