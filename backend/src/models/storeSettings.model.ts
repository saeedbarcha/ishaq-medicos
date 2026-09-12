import mongoose from 'mongoose';
import { toJSON } from './plugins/index.js';

export interface IStoreSettings {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  region: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  mapEmbedUrl?: string;
  latitude?: number;
  longitude?: number;
  foundingYear?: string;
  licenseNumber?: string;
  pharmacistName?: string;
  social: Record<string, string | undefined>;
  announcement: string;
  currency: string;
  currencySymbol: string;
  placeholders: Record<string, boolean>;
  seo: Record<string, unknown>;
}

const storeSettingsSchema = new mongoose.Schema<IStoreSettings>(
  {
    name: { type: String, required: true },
    shortName: String,
    legalName: String,
    tagline: String,
    description: String,
    region: String,
    address: String,
    city: String,
    district: String,
    phone: String,
    whatsapp: String,
    email: String,
    openingHours: String,
    mapEmbedUrl: String,
    latitude: Number,
    longitude: Number,
    foundingYear: String,
    licenseNumber: String,
    pharmacistName: String,
    social: { type: mongoose.Schema.Types.Mixed, default: {} },
    announcement: String,
    currency: { type: String, default: 'PKR' },
    currencySymbol: { type: String, default: 'Rs' },
    placeholders: { type: mongoose.Schema.Types.Mixed, default: {} },
    seo: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

storeSettingsSchema.plugin(toJSON);

export const StoreSettings = mongoose.model<IStoreSettings>('StoreSettings', storeSettingsSchema);
