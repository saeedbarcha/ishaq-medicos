import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/index.js';
import pick from '../utils/pick.js';
import { paginationMeta, sendCreated, sendSuccess } from './response.helper.js';
import { recordAudit } from './audit.helper.js';
import { param } from './params.helper.js';
import type { PaginateOptions } from '../models/plugins/paginate.plugin.js';

interface CrudLike {
  query: (filter: Record<string, unknown>, options: PaginateOptions) => Promise<{
    results: unknown[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }>;
  getById: (id: string) => Promise<unknown>;
  create: (body: any) => Promise<unknown>;
  updateById: (id: string, body: any) => Promise<unknown>;
  deleteById: (id: string) => Promise<unknown>;
}

export function createAdminCrudController(
  service: CrudLike,
  resource: string,
  filterKeys: string[] = ['search', 'active', 'status'],
) {
  const list = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query as Record<string, unknown>, filterKeys);
    const options = pick(req.query as Record<string, unknown>, ['sortBy', 'limit', 'page']) as PaginateOptions;
    if (filter.search) {
      /* services that need regex search handle it themselves; keep string as-is */
    }
    const result = await service.query(filter, {
      ...options,
      limit: Number(options.limit || 20),
      page: Number(options.page || 1),
    });
    sendSuccess(
      res,
      result.results,
      `${resource} retrieved`,
      httpStatus.OK,
      paginationMeta(result.page, result.limit, result.totalResults, result.totalPages),
    );
  });

  const get = catchAsync(async (req: Request, res: Response) => {
    const doc = await service.getById(param(req, 'id'));
    sendSuccess(res, doc, `${resource} retrieved`);
  });

  const create = catchAsync(async (req: Request, res: Response) => {
    const doc = await service.create(req.body);
    const id = (doc as { id?: string }).id;
    await recordAudit(req, 'create', resource, id);
    sendCreated(res, doc, `${resource} created`);
  });

  const update = catchAsync(async (req: Request, res: Response) => {
    const doc = await service.updateById(param(req, 'id'), req.body);
    await recordAudit(req, 'update', resource, param(req, 'id'));
    sendSuccess(res, doc, `${resource} updated`);
  });

  const remove = catchAsync(async (req: Request, res: Response) => {
    await service.deleteById(param(req, 'id'));
    await recordAudit(req, 'delete', resource, param(req, 'id'));
    sendSuccess(res, { id: param(req, 'id') }, `${resource} deleted`);
  });

  return { list, get, create, update, remove };
}
