import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from '../config/config.js';
import { tokenTypes } from '../config/tokens.js';
import { Token } from '../models/token.model.js';
import type { IUser } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function generateToken(
  user: { id: string; email: string; name: string; role: string; isSuperAdmin?: boolean },
  expires: Date,
  type: string,
  secret = config.jwt.secret,
) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isSuperAdmin: user.isSuperAdmin || user.role === 'superAdmin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
  };
  return jwt.sign(payload, secret);
}

export async function saveToken(token: string, userId: string, expires: Date, type: string, blacklisted = false) {
  return Token.create({ token, user: userId, expires, type, blacklisted });
}

export async function generateAuthTokens(user: IUser & { id: string }) {
  const accessExpires = minutesFromNow(config.jwt.accessExpirationMinutes);
  const refreshExpires = daysFromNow(config.jwt.refreshExpirationDays);
  const access = generateToken(user, accessExpires, tokenTypes.ACCESS);
  const refresh = generateToken(
    user,
    refreshExpires,
    tokenTypes.REFRESH,
    config.jwt.refreshSecret,
  );
  await saveToken(refresh, user.id, refreshExpires, tokenTypes.REFRESH);
  return {
    access: { token: access, expires: accessExpires },
    refresh: { token: refresh, expires: refreshExpires },
  };
}

export async function verifyRefreshToken(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as { sub: string; type: string };
    if (payload.type !== tokenTypes.REFRESH) {
      throw new Error('Invalid type');
    }
    const tokenDoc = await Token.findOne({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error('Not found');
    }
    return tokenDoc;
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
}

export default {
  generateToken,
  saveToken,
  generateAuthTokens,
  verifyRefreshToken,
};
