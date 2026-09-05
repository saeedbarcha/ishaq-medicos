import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IReview {
  productId?: string;
  authorDisplay: string;
  rating: number;
  title: string;
  body: string;
  isDemo: boolean;
  approved: boolean;
}

interface ReviewModel extends mongoose.Model<IReview> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IReview>>;
}

const reviewSchema = new mongoose.Schema<IReview, ReviewModel>(
  {
    productId: { type: String, index: true },
    authorDisplay: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, default: '' },
    body: { type: String, default: '' },
    isDemo: { type: Boolean, default: false },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

export const Review = mongoose.model<IReview, ReviewModel>('Review', reviewSchema);
