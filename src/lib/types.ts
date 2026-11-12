/** Backend bilan umumiy turlar (abu-tolib-api: src/users/users.service.ts → PublicUser) */
export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  phone: string | null;
  role: Role;
  grade: number | null;
  region: string | null;
  targetScore: number | null;
  profileComplete: boolean;
}

export interface StartedLogin {
  requestId: string;
  pollSecret: string;
  deepLink: string | null;
  expiresAt: string;
}

export type PollResult =
  | { status: 'pending' }
  | { status: 'expired' }
  | { status: 'confirmed'; user: User };

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export const homeFor = (role: Role) => (role === 'ADMIN' ? '/admin/panel' : '/bosh');
