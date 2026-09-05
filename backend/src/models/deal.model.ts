import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IDeal {
  title: string;
  description: string;
  productIds: string[];
  badge: string;
  endsAt?: Date;
  active: boolean;
}

interface DealModel extends mongoose.Model<IDeal> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IDeal>>;
}

const dealSchema = new mongoose.Schema<IDeal, DealModel>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    productIds: [String],
    badge: { type: String, default: 'Deal' },
    endsAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

dealSchema.plugin(toJSON);
dealSchema.plugin(paginate);

export const Deal = mongoose.model<IDeal, DealModel>('Deal', dealSchema);
