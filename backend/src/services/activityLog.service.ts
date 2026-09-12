import { ActivityLog } from '../models/content.model.js';

export const activityLogService = {
  create: async (body: Record<string, unknown>) => ActivityLog.create(body),
  query: async (filter: Record<string, unknown>, options: Record<string, unknown>) =>
    ActivityLog.paginate(filter, options),
};
