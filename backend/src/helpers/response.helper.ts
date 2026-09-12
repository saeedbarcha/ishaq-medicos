import type { Response } from 'express';
import httpStatus from 'http-status';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function paginationMeta(page: number, limit: number, total: number, totalPages: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function sendSuccess(
  res: Response,
  data: unknown,
  message = 'OK',
  statusCode: number = httpStatus.OK,
  meta?: PaginationMeta | Record<string, unknown>,
) {
  const payload: Record<string, unknown> = {
    success: true,
    message,
    data,
  };
  if (meta) payload.meta = meta;
  res.status(statusCode).send(payload);
}

export function sendCreated(res: Response, data: unknown, message = 'Created') {
  sendSuccess(res, data, message, httpStatus.CREATED);
}
