import type { DemoUser, TeamMember, UserRole } from '@shared/types';
import { demoStaff } from '@/data/team';
import { demoUsers } from '@/data/users';

const KEY = 'ishaq-local-staff-v2';
const STAFF_ROLES: UserRole[] = ['staff', 'pharmacist', 'manager', 'admin'];

export type StaffRecord = DemoUser & {
  jobTitle?: string;
  bio?: string;
  photoUrl?: string;
  showOnWebsite?: boolean;
  sortOrder?: number;
  active?: boolean;
};

export function roleLabel(role: string) {
  const labels: Record<string, string> = {
    pharmacist: 'Pharmacist',
    staff: 'Counter staff',
    manager: 'Manager',
    admin: 'Store admin',
    superAdmin: 'Administrator',
    customer: 'Customer',
  };
  return labels[role] ?? role;
}

export function toTeamMember(user: StaffRecord): TeamMember {
  return {
    id: user.id,
    name: user.name,
    jobTitle: user.jobTitle?.trim() || roleLabel(user.role),
    bio: user.bio ?? '',
    photoUrl: user.photoUrl ?? '',
    role: user.role,
  };
}

export function readLocalStaff(): StaffRecord[] {
  try {
    const rows = JSON.parse(localStorage.getItem(KEY) ?? '[]') as StaffRecord[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

function writeLocalStaff(rows: StaffRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function seedStaff(): StaffRecord[] {
  const byId = new Map<string, StaffRecord>();
  for (const user of demoUsers) {
    byId.set(user.id, {
      ...user,
      active: user.active !== false,
      showOnWebsite: Boolean(user.showOnWebsite),
    });
  }
  for (const user of demoStaff) {
    byId.set(user.id, {
      ...user,
      active: user.active !== false,
      showOnWebsite: user.showOnWebsite !== false,
    });
  }
  return [...byId.values()];
}

export function allAdminUsers(): StaffRecord[] {
  const extras = readLocalStaff();
  const overlay = new Map(extras.map((row) => [row.id, row]));
  const fromSeed = seedStaff().map((user) => overlay.get(user.id) ?? user);
  const extraOnly = extras.filter(
    (row) => !fromSeed.some((user) => user.id === row.id || user.email.toLowerCase() === row.email.toLowerCase()),
  );
  return [...fromSeed, ...extraOnly];
}

export function publicTeam(): TeamMember[] {
  return allAdminUsers()
    .filter((user) => user.showOnWebsite && user.active !== false && STAFF_ROLES.includes(user.role))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name))
    .map(toTeamMember);
}

export function createLocalStaff(body: Record<string, unknown>): StaffRecord {
  const email = String(body.email ?? '').toLowerCase().trim();
  if (!email) throw new Error('Email is required');
  if (allAdminUsers().some((u) => u.email.toLowerCase() === email)) {
    throw new Error('Email already taken');
  }
  const row: StaffRecord = {
    id: `staff-${Date.now()}`,
    name: String(body.name ?? '').trim(),
    email,
    phone: String(body.phone ?? ''),
    role: (body.role as UserRole) || 'staff',
    jobTitle: String(body.jobTitle ?? ''),
    bio: String(body.bio ?? ''),
    photoUrl: String(body.photoUrl ?? ''),
    showOnWebsite: Boolean(body.showOnWebsite),
    sortOrder: Number(body.sortOrder || 0),
    active: body.active === false ? false : true,
  };
  writeLocalStaff([...readLocalStaff(), row]);
  return row;
}

export function mergeAdminUsers(apiUsers: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  const catalog = allAdminUsers() as unknown as Array<Record<string, unknown>>;
  if (apiUsers.length === 0) return catalog;
  const emails = new Set(apiUsers.map((row) => String(row.email ?? '').toLowerCase()));
  const ids = new Set(apiUsers.map((row) => String(row.id ?? '')));
  const extras = catalog.filter(
    (row) => !ids.has(String(row.id ?? '')) && !emails.has(String(row.email ?? '').toLowerCase()),
  );
  return [...apiUsers, ...extras];
}

export function mergePublicTeam(apiMembers: TeamMember[]): TeamMember[] {
  const catalog = publicTeam();
  if (apiMembers.length === 0) return catalog;
  const ids = new Set(apiMembers.map((row) => row.id));
  return [...apiMembers, ...catalog.filter((row) => !ids.has(row.id))];
}

export function updateLocalStaff(id: string, body: Record<string, unknown>): StaffRecord | null {
  const current = allAdminUsers().find((row) => row.id === id);
  if (!current) return null;
  const next: StaffRecord = {
    ...current,
    ...body,
    id: current.id,
    email: typeof body.email === 'string' && body.email.trim() ? body.email.trim().toLowerCase() : current.email,
    name: typeof body.name === 'string' ? body.name : current.name,
    phone: body.phone !== undefined ? String(body.phone) : current.phone,
    role: (typeof body.role === 'string' ? body.role : current.role) as UserRole,
    jobTitle: body.jobTitle !== undefined ? String(body.jobTitle) : current.jobTitle,
    bio: body.bio !== undefined ? String(body.bio) : current.bio,
    photoUrl: body.photoUrl !== undefined ? String(body.photoUrl) : current.photoUrl,
    showOnWebsite: body.showOnWebsite !== undefined ? Boolean(body.showOnWebsite) : current.showOnWebsite,
    sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : current.sortOrder,
    active: body.active !== undefined ? body.active !== false : current.active,
  };
  writeLocalStaff([...readLocalStaff().filter((row) => row.id !== id), next]);
  return next;
}

export function deleteLocalStaff(id: string) {
  if (demoUsers.some((row) => row.id === id)) {
    throw new Error('Seed accounts cannot be deleted in local mode.');
  }
  writeLocalStaff(readLocalStaff().filter((row) => row.id !== id));
  return { id };
}
