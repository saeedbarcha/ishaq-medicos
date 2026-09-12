import httpStatus from 'http-status';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { createCrudService } from '../helpers/crud.helper.js';

const base = createCrudService({ model: User, resourceName: 'User', uniqueField: 'email' });

export async function createUser(body: Record<string, unknown>) {
  if (await User.isEmailTaken(String(body.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(body);
}

export const queryUsers = base.query;
export const getUserById = base.getById;

export async function updateUserById(id: string, body: Record<string, unknown>) {
  const user = await getUserById(id);
  if (body.email && (await User.isEmailTaken(String(body.email), id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, body);
  await user.save();
  return user;
}

export const deleteUserById = base.deleteById;

const PUBLIC_TEAM_ROLES = ['staff', 'pharmacist', 'manager', 'admin'];

function publicTitle(user: { jobTitle?: string; role: string }) {
  if (user.jobTitle?.trim()) return user.jobTitle.trim();
  const labels: Record<string, string> = {
    pharmacist: 'Pharmacist',
    staff: 'Counter staff',
    manager: 'Manager',
    admin: 'Store admin',
  };
  return labels[user.role] ?? 'Team';
}

export async function listPublicTeam() {
  const users = await User.find({
    active: { $ne: false },
    showOnWebsite: true,
    role: { $in: PUBLIC_TEAM_ROLES },
  })
    .sort({ sortOrder: 1, name: 1 })
    .select('name jobTitle bio photoUrl role sortOrder');
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    jobTitle: publicTitle(user),
    bio: user.bio ?? '',
    photoUrl: user.photoUrl ?? '',
    role: user.role,
  }));
}

export default {
  createUser,
  queryUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  listPublicTeam,
};
