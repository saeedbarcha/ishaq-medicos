import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { config } from '../config/config.js';
import { logger } from '../config/logger.js';
import ApiError from '../utils/ApiError.js';

export const errorConverter = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    next(err);
    return;
  }
  const raw = err as { statusCode?: number; message?: string; stack?: string };
  const isMongoose = err instanceof mongoose.Error;
  const statusCode = raw.statusCode || (isMongoose ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR);
  const message = raw.message || String(httpStatus[statusCode as keyof typeof httpStatus] ?? 'Error');
  next(new ApiError(statusCode, message, {}, false, raw.stack));
};

export const errorHandler = (err: ApiError, req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message, additional_info } = err;

  res.locals.errorMessage = err.message;

  const response: Record<string, unknown> = {
    success: false,
    detail: `Requested at ${req.originalUrl}`,
    message,
    action: req.method,
    code: statusCode,
  };

  if (additional_info && Object.keys(additional_info).length) {
    response.additional_info = additional_info;
  }

  if (config.env === 'development') {
    response.stack = err.stack;
    logger.error(`${statusCode} - ${message}`);
  } else if (!err.isOperational) {
    logger.error(`${statusCode} - ${message}`);
  }

  if (config.env === 'production' && !err.isOperational) {
    return res.status(statusCode).send({
      success: false,
      detail: `Requested at ${req.originalUrl}`,
      message: 'Something went wrong',
      action: req.method,
      code: statusCode,
    });
  }

  res.status(statusCode).send(response);
};
