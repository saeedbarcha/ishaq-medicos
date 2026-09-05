import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

export async function getByIdOrThrow<T>(
  model: mongoose.Model<T>,
  id: string,
  notFoundMessage: string,
) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
  }
  const doc = await model.findById(id);
  if (!doc) {
    throw new ApiError(httpStatus.NOT_FOUND, notFoundMessage);
  }
  return doc;
}

export function assertObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid id');
  }
}
