import { catchAsync } from '../../utils/index.js';
import pick from '../../utils/pick.js';
import { paginationMeta, sendSuccess } from '../../helpers/response.helper.js';
import { recordAudit } from '../../helpers/audit.helper.js';
import { orderService, prescriptionService } from '../../services/order.service.js';
import { inquiryService, newsletterService } from '../../services/content.service.js';
import { activityLogService } from '../../services/activityLog.service.js';
import { param } from '../../helpers/params.helper.js';
import httpStatus from 'http-status';

export const listOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query as Record<string, unknown>, ['status', 'paymentStatus', 'phone', 'publicRef']);
  const result = await orderService.query(filter, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
    sortBy: (req.query.sortBy as string) || 'createdAt:desc',
  });
  sendSuccess(res, result.results, 'Orders retrieved', httpStatus.OK, paginationMeta(result.page, result.limit, result.totalResults, result.totalPages));
});

export const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getById(param(req, 'id'));
  sendSuccess(res, order, 'Order retrieved');
});

export const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateById(param(req, 'id'), req.body);
  await recordAudit(req, 'update', 'order', param(req, 'id'), { status: req.body.status });
  sendSuccess(res, order, 'Order updated');
});

export const listPrescriptions = catchAsync(async (req, res) => {
  const filter = pick(req.query as Record<string, unknown>, ['status', 'phone']);
  const result = await prescriptionService.query(filter, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
    sortBy: (req.query.sortBy as string) || 'createdAt:desc',
  });
  sendSuccess(res, result.results, 'Prescriptions retrieved', httpStatus.OK, paginationMeta(result.page, result.limit, result.totalResults, result.totalPages));
});

export const getPrescription = catchAsync(async (req, res) => {
  const rx = await prescriptionService.getById(param(req, 'id'));
  sendSuccess(res, rx, 'Prescription retrieved');
});

export const updatePrescription = catchAsync(async (req, res) => {
  const body = { ...req.body, reviewedBy: req.user?.id };
  const rx = await prescriptionService.updateById(param(req, 'id'), body);
  await recordAudit(req, 'update', 'prescription', param(req, 'id'), { status: req.body.status });
  sendSuccess(res, rx, 'Prescription updated');
});

export const listInquiries = catchAsync(async (req, res) => {
  const filter = pick(req.query as Record<string, unknown>, ['status']);
  const result = await inquiryService.query(filter, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
    sortBy: 'createdAt:desc',
  });
  sendSuccess(res, result.results, 'Inquiries retrieved', httpStatus.OK, paginationMeta(result.page, result.limit, result.totalResults, result.totalPages));
});

export const updateInquiry = catchAsync(async (req, res) => {
  const inquiry = await inquiryService.updateById(param(req, 'id'), req.body);
  await recordAudit(req, 'update', 'inquiry', param(req, 'id'));
  sendSuccess(res, inquiry, 'Inquiry updated');
});

export const listSubscribers = catchAsync(async (req, res) => {
  const result = await newsletterService.query({}, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 50),
    sortBy: 'createdAt:desc',
  });
  sendSuccess(res, result.results, 'Subscribers retrieved', httpStatus.OK, paginationMeta(result.page, result.limit, result.totalResults, result.totalPages));
});

export const listAuditLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query as Record<string, unknown>, ['resource', 'action', 'actorEmail']);
  const result = await activityLogService.query(filter, {
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 30),
    sortBy: 'createdAt:desc',
  });
  sendSuccess(res, result.results, 'Audit logs retrieved', httpStatus.OK, paginationMeta(result.page, result.limit, result.totalResults, result.totalPages));
});
