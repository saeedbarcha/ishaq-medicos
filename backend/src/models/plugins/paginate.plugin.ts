import type { Model, PopulateOptions, SortOrder } from 'mongoose';

export interface PaginateOptions {
  sortBy?: string;
  populate?: string | PopulateOptions | PopulateOptions[];
  select?: string;
  limit?: number;
  page?: number;
}

export interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

function parseSort(sortBy?: string): Record<string, SortOrder> {
  if (!sortBy) return { createdAt: -1 };
  const sort: Record<string, SortOrder> = {};
  sortBy.split(',').forEach((sortOption) => {
    const [key, order] = sortOption.split(':');
    if (key) sort[key] = order === 'asc' ? 1 : -1;
  });
  return sort;
}

export function paginate<T>(schema: { statics: Record<string, unknown> }) {
  schema.statics.paginate = async function paginateFunction(
    this: Model<T>,
    filter: Record<string, unknown> = {},
    options: PaginateOptions = {},
  ): Promise<QueryResult<T>> {
    const limit = options.limit && Number(options.limit) > 0 ? Number(options.limit) : 10;
    const page = options.page && Number(options.page) > 0 ? Number(options.page) : 1;
    const skip = (page - 1) * limit;
    const sort = parseSort(options.sortBy);

    const countPromise = this.countDocuments(filter);
    let docsQuery = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.select) {
      docsQuery = docsQuery.select(options.select);
    }
    if (options.populate) {
      docsQuery = docsQuery.populate(options.populate as PopulateOptions);
    }

    const [raw, totalResults] = await Promise.all([docsQuery.lean(), countPromise]);
    const totalPages = Math.max(1, Math.ceil(totalResults / limit) || 1);
    const results = (raw as Array<{ _id?: unknown; __v?: unknown }>).map((doc) => {
      const { _id, __v, ...rest } = doc;
      return { id: _id != null ? String(_id) : undefined, ...rest };
    }) as T[];

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  };
}

export default paginate;
