import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IFaq {
  question: string;
  answer: string;
  group: string;
  sortOrder: number;
  active: boolean;
}

interface FaqModel extends mongoose.Model<IFaq> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IFaq>>;
}

const faqSchema = new mongoose.Schema<IFaq, FaqModel>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    group: { type: String, enum: ['ordering', 'prescription', 'delivery', 'products'], default: 'ordering' },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

faqSchema.plugin(toJSON);
faqSchema.plugin(paginate);

export const Faq = mongoose.model<IFaq, FaqModel>('Faq', faqSchema);
