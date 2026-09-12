import Joi from 'joi';
import httpStatus from 'http-status';
import type { NextFunction, Request, Response } from 'express';
import pick from '../utils/pick.js';
import ApiError from '../utils/ApiError.js';

type SchemaPiece = Record<string, unknown>;

const validate = (schema: SchemaPiece) => {
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema as Record<string, unknown>, ['params', 'query', 'body']);
    const object = pick(req as unknown as Record<string, unknown>, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' }, abortEarly: false })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
  };
  (middleware as { isValidate?: boolean }).isValidate = true;
  (middleware as { validationSchema?: SchemaPiece }).validationSchema = schema;
  return middleware;
};

export default validate;
