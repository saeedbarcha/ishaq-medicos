import httpStatus from 'http-status';
import type { Model } from 'mongoose';
import ApiError from '../utils/ApiError.js';
import { getByIdOrThrow } from './document.helper.js';
import type { PaginateOptions } from '../models/plugins/paginate.plugin.js';

interface CrudConfig<T> {
  model: Model<T>;
  resourceName: string;
  uniqueField?: keyof T & string;
}

export function createCrudService<T>({ model, resourceName, uniqueField }: CrudConfig<T>) {
  const notFound = `${resourceName} not found`;

  const create = async (body: Record<string, unknown>) => {
    if (uniqueField && body[uniqueField as string]) {
      const exists = await model.findOne({ [uniqueField]: body[uniqueField as string] } as Record<string, unknown>);
      if (exists) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${String(uniqueField)} already in use`);
      }
    }
    return model.create(body as Partial<T>);
  };

  const query = async (filter: Record<string, unknown>, options: PaginateOptions) => {
    return (model as Model<T> & { paginate: typeof model extends never ? never : Function }).paginate(filter, options);
  };

  const getById = async (id: string) => getByIdOrThrow(model, id, notFound);

  const updateById = async (id: string, body: Record<string, unknown>) => {
    const doc = await getByIdOrThrow(model, id, notFound);
    if (uniqueField && body[uniqueField as string] && body[uniqueField as string] !== (doc as T)[uniqueField]) {
      const exists = await model.findOne({ [uniqueField]: body[uniqueField as string] } as Record<string, unknown>);
      if (exists) {
        throw new ApiError(httpStatus.BAD_REQUEST, `${String(uniqueField)} already in use`);
      }
    }
    Object.assign(doc, body);
    await doc.save();
    return doc;
  };

  const deleteById = async (id: string) => {
    const doc = await getByIdOrThrow(model, id, notFound);
    await doc.deleteOne();
    return doc;
  };

  return { create, query, getById, updateById, deleteById };
}
