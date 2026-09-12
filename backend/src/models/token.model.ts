import mongoose from 'mongoose';
import { tokenTypes } from '../config/tokens.js';
import { toJSON } from './plugins/index.js';

export interface IToken {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

const tokenSchema = new mongoose.Schema<IToken>(
  {
    token: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(tokenTypes), required: true },
    expires: { type: Date, required: true },
    blacklisted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

tokenSchema.plugin(toJSON);

export const Token = mongoose.model<IToken>('Token', tokenSchema);
