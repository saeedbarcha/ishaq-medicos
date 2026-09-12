import Joi from 'joi';
import mongoose from 'mongoose';

export const objectId = (value: string, helpers: Joi.CustomHelpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

export const password = (value: string, helpers: Joi.CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({ custom: 'password must be at least 8 characters' });
  }
  if (!/\d/.test(value) || !/[A-Za-z]/.test(value)) {
    return helpers.message({ custom: 'password must contain at least 1 letter and 1 number' });
  }
  return value;
};
