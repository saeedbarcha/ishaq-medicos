import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IDeliveryZone {
  name: string;
  district: string;
  areas: string[];
  estimatedDays: string;
  notes: string;
  active: boolean;
}

interface DeliveryZoneModel extends mongoose.Model<IDeliveryZone> {
  paginate: (
    filter: Record<string, unknown>,
    options?: PaginateOptions,
  ) => Promise<QueryResult<IDeliveryZone>>;
}

const deliveryZoneSchema = new mongoose.Schema<IDeliveryZone, DeliveryZoneModel>(
  {
    name: { type: String, required: true },
    district: { type: String, required: true },
    areas: [String],
    estimatedDays: { type: String, default: '2-5' },
    notes: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

deliveryZoneSchema.plugin(toJSON);
deliveryZoneSchema.plugin(paginate);

export const DeliveryZone = mongoose.model<IDeliveryZone, DeliveryZoneModel>('DeliveryZone', deliveryZoneSchema);
