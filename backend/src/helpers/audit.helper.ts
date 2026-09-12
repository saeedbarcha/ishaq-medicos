import type { Request } from 'express';
import { activityLogService } from '../services/activityLog.service.js';

export async function recordAudit(
  req: Request,
  action: string,
  resource: string,
  resourceId?: string,
  meta?: Record<string, unknown>,
) {
  const user = req.user;
  await activityLogService.create({
    actorId: user?.id,
    actorEmail: user?.email,
    actorRole: user?.role,
    action,
    resource,
    resourceId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    meta,
  });
}
