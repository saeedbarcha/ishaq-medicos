import httpStatus from 'http-status';
import { User } from '../models/user.model.js';
import { Token } from '../models/token.model.js';
import { tokenTypes } from '../config/tokens.js';
import ApiError from '../utils/ApiError.js';
import tokenService from './token.service.js';

function publicUser(user: { id: string; name: string; email: string; phone?: string; role: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function loginUserWithEmailAndPassword(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !user.password || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user.active) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account is disabled');
  }
  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

export async function loginStaff(email: string, password: string) {
  const user = await loginUserWithEmailAndPassword(email, password);
  const staff = ['staff', 'pharmacist', 'manager', 'admin', 'superAdmin'];
  if (!staff.includes(user.role)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Staff access required');
  }
  return user;
}

export async function registerCustomer(body: { name: string; email: string; password: string; phone?: string }) {
  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create({ ...body, role: 'customer' });
  const tokens = await tokenService.generateAuthTokens(user);
  return { user: publicUser(user), tokens };
}

export async function login(email: string, password: string) {
  const user = await loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  return { user: publicUser(user), tokens };
}

export async function adminLogin(email: string, password: string) {
  const user = await loginStaff(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  return { user: publicUser(user), tokens };
}

export async function refreshAuth(refreshToken: string) {
  const tokenDoc = await tokenService.verifyRefreshToken(refreshToken);
  const user = await User.findById(tokenDoc.user);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  await tokenDoc.deleteOne();
  const tokens = await tokenService.generateAuthTokens(user);
  return { user: publicUser(user), tokens };
}

export async function logout(refreshToken: string) {
  const tokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (tokenDoc) {
    await tokenDoc.deleteOne();
  }
}

export { publicUser };
