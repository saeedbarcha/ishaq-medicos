import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  handler: (_req, _res, next) => {
    next(new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many attempts, please try again later'));
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 400,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests'));
  },
});

export function mongoGuard(req: Request, _res: Response, next: NextFunction) {
  if (req.app.locals.mongoReady === false) {
    return next(new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Catalog database unavailable'));
  }
  next();
}
