import httpStatus from 'http-status';
import { catchAsync } from '../../utils/index.js';
import { sendSuccess } from '../../helpers/response.helper.js';
import * as authService from '../../services/auth.service.js';
import { recordAudit } from '../../helpers/audit.helper.js';
import { createAdminCrudController } from '../../helpers/crudController.helper.js';
import userService from '../../services/user.service.js';
import dashboardService from '../../services/dashboard.service.js';

export const login = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.adminLogin(req.body.email, req.body.password);
  req.user = { id: user.id, email: user.email, name: user.name, role: user.role, isSuperAdmin: user.role === 'superAdmin' };
  await recordAudit(req, 'login', 'auth', user.id);
  sendSuccess(res, { user, tokens }, 'Logged in');
});

export const refreshTokens = catchAsync(async (req, res) => {
  const result = await authService.refreshAuth(req.body.refreshToken);
  sendSuccess(res, result, 'Tokens refreshed');
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  sendSuccess(res, { loggedOut: true }, 'Logged out');
});

export const me = catchAsync(async (req, res) => {
  sendSuccess(res, req.user, 'Profile retrieved');
});

export const dashboard = catchAsync(async (_req, res) => {
  const metrics = await dashboardService.getAdminMetrics();
  sendSuccess(res, metrics, 'Metrics retrieved');
});

export const users = createAdminCrudController(
  {
    query: userService.queryUsers,
    getById: userService.getUserById,
    create: userService.createUser,
    updateById: userService.updateUserById,
    deleteById: userService.deleteUserById,
  },
  'User',
  ['role', 'active', 'email', 'search'],
);

export default { login, refreshTokens, logout, me, dashboard, users };

void httpStatus;
