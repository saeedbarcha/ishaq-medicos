import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from '../config/config.js';
import { roleRights } from '../config/roles.js';
import { tokenTypes } from '../config/tokens.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isSuperAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface TokenPayload {
  sub: string;
  type: string;
  role: string;
  email: string;
  name: string;
  isSuperAdmin?: boolean;
}

function hasPermission(userRights: string[], requiredRights: string[]) {
  if (userRights.includes('*')) return true;
  return requiredRights.every((right) => userRights.includes(right));
}

async function loadUserFromToken(token: string): Promise<AuthUser> {
  const payload = jwt.verify(token, config.jwt.secret) as TokenPayload;
  if (payload.type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  const user = await User.findById(payload.sub);
  if (!user || user.active === false) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please login first in order to grant access');
  }
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isSuperAdmin: user.role === 'superAdmin' || user.isSuperAdmin === true,
  };
}

function extractBearer(req: Request) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.substring(7);
  if (req.cookies?.accessToken) return req.cookies.accessToken as string;
  return null;
}

export const admin = (...requiredRights: string[]) => {
  const middleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractBearer(req);
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please login first in order to grant access');
      }
      const user = await loadUserFromToken(token);
      const staff = ['staff', 'pharmacist', 'manager', 'admin', 'superAdmin'];
      if (!staff.includes(user.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      if (requiredRights.length && !user.isSuperAdmin) {
        const userRights = roleRights.get(user.role) ?? [];
        if (!hasPermission(userRights, requiredRights)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }
      }
      req.user = user;
      next();
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
  };
  (middleware as { isAdminAuth?: boolean }).isAdminAuth = true;
  (middleware as { requiredRights?: string[] }).requiredRights = requiredRights;
  return middleware;
};

export const auth =
  (...requiredRights: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractBearer(req);
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
      }
      const user = await loadUserFromToken(token);
      if (requiredRights.length && !user.isSuperAdmin) {
        const userRights = roleRights.get(user.role) ?? [];
        if (!hasPermission(userRights, requiredRights)) {
          throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }
      }
      req.user = user;
      next();
    } catch (error) {
      next(error instanceof ApiError ? error : new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
  };

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearer(req);
    if (token) {
      req.user = await loadUserFromToken(token);
    }
  } catch {
    /* public routes stay public if the token is invalid */
  }
  next();
};
