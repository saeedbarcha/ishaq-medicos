import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { paginate, toJSON } from './plugins/index.js';
import type { PaginateOptions, QueryResult } from './plugins/paginate.plugin.js';

export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'customer' | 'staff' | 'pharmacist' | 'manager' | 'admin' | 'superAdmin';
  isSuperAdmin: boolean;
  active: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  jobTitle?: string;
  bio?: string;
  photoUrl?: string;
  showOnWebsite?: boolean;
  sortOrder?: number;
  isPasswordMatch: (password: string) => Promise<boolean>;
}

interface UserModel extends mongoose.Model<IUser> {
  isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>;
  paginate: (filter: Record<string, unknown>, options?: PaginateOptions) => Promise<QueryResult<IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, private: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ['customer', 'staff', 'pharmacist', 'manager', 'admin', 'superAdmin'],
      default: 'customer',
    },
    isSuperAdmin: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
    jobTitle: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true },
    photoUrl: { type: String, default: '', trim: true },
    showOnWebsite: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string) {
  const user = await this.findOne({ email, ...(excludeUserId ? { _id: { $ne: excludeUserId } } : {}) });
  return Boolean(user);
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
