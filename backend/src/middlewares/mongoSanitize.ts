import type { NextFunction, Request, Response } from 'express';

function stripOperators(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripOperators);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      if (key.startsWith('$') || key.includes('.')) return;
      out[key] = stripOperators(nested);
    });
    return out;
  }
  return value;
}

/** Express 5 exposes `req.query` as a getter, so express-mongo-sanitize cannot assign it. */
export function mongoSanitize(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = stripOperators(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    Object.assign(req.params, stripOperators(req.params));
  }
  next();
}
