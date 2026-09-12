import Joi from 'joi';
import { objectId, password } from './custom.validation.js';

export const login = {
  body: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  }),
};

export const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().custom(password).required(),
    phone: Joi.string().allow('', null),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const idParam = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};

export const slugParam = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
};

export const pagination = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    search: Joi.string().allow(''),
    q: Joi.string().allow(''),
  }),
};

export const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().custom(password).required(),
    phone: Joi.string().allow('', null),
    role: Joi.string().valid('customer', 'staff', 'pharmacist', 'manager', 'admin', 'superAdmin'),
    active: Joi.boolean(),
    jobTitle: Joi.string().allow('').max(80),
    bio: Joi.string().allow('').max(600),
    photoUrl: Joi.string().allow('').max(2000),
    showOnWebsite: Joi.boolean(),
    sortOrder: Joi.number().integer().min(0),
  }),
};

export const updateUser = {
  params: Joi.object().keys({ id: Joi.string().custom(objectId) }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email({ tlds: { allow: false } }),
      password: Joi.string().custom(password),
      phone: Joi.string().allow('', null),
      role: Joi.string().valid('customer', 'staff', 'pharmacist', 'manager', 'admin', 'superAdmin'),
      active: Joi.boolean(),
      jobTitle: Joi.string().allow('').max(80),
      bio: Joi.string().allow('').max(600),
      photoUrl: Joi.string().allow('').max(2000),
      showOnWebsite: Joi.boolean(),
      sortOrder: Joi.number().integer().min(0),
    })
    .min(1),
};

export const authValidation = { login, register, refreshTokens, logout, idParam, slugParam, pagination, createUser, updateUser };
