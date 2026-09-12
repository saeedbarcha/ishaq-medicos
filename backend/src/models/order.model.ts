import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IOrder {
  publicRef: string;
  accessToken: string;
  userId?: string;
  status: string;
  items: Array<{
    productId: string;
    name: string;
    slug: string;
    packSize: string;
    quantity: number;
    unitPrice: number;
    prescriptionRequired: boolean;
  }>;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  phone: string;
  email?: string;
  addressSummary: string;
  notes?: string;
  isDemo: boolean;
  adminNotes?: string;
}

interface OrderModel extends mongoose.Model<IOrder> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IOrder>>;
}

const orderSchema = new mongoose.Schema<IOrder, OrderModel>(
  {
    publicRef: { type: String, required: true, unique: true, index: true },
    accessToken: { type: String, required: true, private: true },
    userId: String,
    status: {
      type: String,
      enum: [
        'pending',
        'prescription_review',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'dispatched',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },
    items: [
      {
        productId: String,
        name: String,
        slug: String,
        packSize: String,
        quantity: Number,
        unitPrice: Number,
        prescriptionRequired: Boolean,
      },
    ],
    subtotal: Number,
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: Number,
    paymentMethod: {
      type: String,
      enum: ['cod', 'store_pickup', 'bank_transfer', 'jazzcash', 'easypaisa'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'awaiting_proof', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    addressSummary: { type: String, default: '' },
    notes: String,
    isDemo: { type: Boolean, default: false },
    adminNotes: String,
  },
  { timestamps: true },
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

export const Order = mongoose.model<IOrder, OrderModel>('Order', orderSchema);
