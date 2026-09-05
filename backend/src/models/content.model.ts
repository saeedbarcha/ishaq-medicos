import mongoose from 'mongoose';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IInquiry {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
}

interface InquiryModel extends mongoose.Model<IInquiry> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IInquiry>>;
}

const inquirySchema = new mongoose.Schema<IInquiry, InquiryModel>(
  {
    name: { type: String, required: true },
    email: String,
    phone: String,
    subject: String,
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new', index: true },
  },
  { timestamps: true },
);

inquirySchema.plugin(toJSON);
inquirySchema.plugin(paginate);

export const Inquiry = mongoose.model<IInquiry, InquiryModel>('Inquiry', inquirySchema);

export interface INewsletter {
  email: string;
  active: boolean;
}

interface NewsletterModel extends mongoose.Model<INewsletter> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<INewsletter>>;
}

const newsletterSchema = new mongoose.Schema<INewsletter, NewsletterModel>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

newsletterSchema.plugin(toJSON);
newsletterSchema.plugin(paginate);

export const Newsletter = mongoose.model<INewsletter, NewsletterModel>('Newsletter', newsletterSchema);

export interface ICoupon {
  code: string;
  description: string;
  percentOff?: number;
  amountOff?: number;
  minOrder?: number;
  active: boolean;
  startsAt?: Date;
  endsAt?: Date;
  usageLimit?: number;
  usedCount: number;
}

interface CouponModel extends mongoose.Model<ICoupon> {
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<ICoupon>>;
}

const couponSchema = new mongoose.Schema<ICoupon, CouponModel>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    percentOff: Number,
    amountOff: Number,
    minOrder: Number,
    active: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
    usageLimit: Number,
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

couponSchema.plugin(toJSON);
couponSchema.plugin(paginate);

export const Coupon = mongoose.model<ICoupon, CouponModel>('Coupon', couponSchema);

export interface IActivityLog {
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  method?: string;
  path?: string;
  ip?: string;
  meta?: Record<string, unknown>;
}

interface ActivityLogModel extends mongoose.Model<IActivityLog> {
  paginate: (
    filter: Record<string, unknown>,
    options?: PaginateOptions,
  ) => Promise<QueryResult<IActivityLog>>;
}

const activityLogSchema = new mongoose.Schema<IActivityLog, ActivityLogModel>(
  {
    actorId: String,
    actorEmail: String,
    actorRole: String,
    action: { type: String, required: true },
    resource: { type: String, required: true, index: true },
    resourceId: String,
    method: String,
    path: String,
    ip: String,
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.plugin(toJSON);
activityLogSchema.plugin(paginate);

export const ActivityLog = mongoose.model<IActivityLog, ActivityLogModel>('ActivityLog', activityLogSchema);
