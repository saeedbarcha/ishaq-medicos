import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IInventoryBatch {
  productId: string;
  batchNumber: string;
  quantity: number;
  reservedQuantity: number;
  expiryDate: Date;
  purchaseDate: Date;
  supplierReference?: string;
  notes?: string;
  active: boolean;
}

interface InventoryModel extends mongoose.Model<IInventoryBatch> {
  paginate: (
    filter: Record<string, unknown>,
    options?: PaginateOptions,
  ) => Promise<QueryResult<IInventoryBatch>>;
}

const inventoryBatchSchema = new mongoose.Schema<IInventoryBatch, InventoryModel>(
  {
    productId: { type: String, required: true, index: true },
    batchNumber: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    reservedQuantity: { type: Number, default: 0, min: 0 },
    expiryDate: { type: Date, required: true, index: true },
    purchaseDate: { type: Date, default: Date.now },
    supplierReference: String,
    notes: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

inventoryBatchSchema.index({ productId: 1, batchNumber: 1 }, { unique: true });
inventoryBatchSchema.plugin(toJSON);
inventoryBatchSchema.plugin(paginate);

export const InventoryBatch = mongoose.model<IInventoryBatch, InventoryModel>('InventoryBatch', inventoryBatchSchema);
