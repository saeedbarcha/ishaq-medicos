import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IPrescription {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: string;
  fileName?: string;
  filePath?: string;
  isDemo: boolean;
  pharmacistNotes?: string;
  reviewedBy?: string;
}

interface PrescriptionModel extends mongoose.Model<IPrescription> {
  paginate: (
    filter: Record<string, unknown>,
    options?: PaginateOptions,
  ) => Promise<QueryResult<IPrescription>>;
}

const prescriptionSchema = new mongoose.Schema<IPrescription, PrescriptionModel>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: String,
    notes: String,
    status: {
      type: String,
      enum: [
        'received',
        'under_review',
        'needs_clarification',
        'approved',
        'unavailable',
        'ready_for_order',
        'completed',
      ],
      default: 'received',
      index: true,
    },
    fileName: String,
    filePath: { type: String, private: true },
    isDemo: { type: Boolean, default: false },
    pharmacistNotes: String,
    reviewedBy: String,
  },
  { timestamps: true },
);

prescriptionSchema.plugin(toJSON);
prescriptionSchema.plugin(paginate);

export const Prescription = mongoose.model<IPrescription, PrescriptionModel>('Prescription', prescriptionSchema);
