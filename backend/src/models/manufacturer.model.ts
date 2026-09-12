import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IManufacturer {
  name: string;
  slug: string;
  country?: string;
  active: boolean;
}

interface ManufacturerModel extends mongoose.Model<IManufacturer> {
  paginate: (
    filter: Record<string, unknown>,
    options?: PaginateOptions,
  ) => Promise<QueryResult<IManufacturer>>;
}

const manufacturerSchema = new mongoose.Schema<IManufacturer, ManufacturerModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    country: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

manufacturerSchema.plugin(toJSON);
manufacturerSchema.plugin(paginate);

export const Manufacturer = mongoose.model<IManufacturer, ManufacturerModel>('Manufacturer', manufacturerSchema);
