import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { User } from './types';

/** Server komponentlardan backend'ga murojaat (Docker ichida: http://api:4000) */
const API_INTERNAL = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

export async function serverApi<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  const jar = await cookies();
  const res = await fetch(`${API_INTERNAL}/api/v1${path}`, {
    ...init,
    headers: { ...init.headers, cookie: jar.toString() },
    cache: 'no-store',
  });
  if (res.status === 401 || res.status === 403 || res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return (await res.json()) as T;
}

/** Joriy foydalanuvchi (bitta so'rov ichida keshlanadi) */
export const getMe = cache(() => serverApi<User>('/auth/me'));

/** Layout'larda: kirmagan bo'lsa /kirish ga */
export async function requireUser(): Promise<User> {
  const me = await getMe();
  if (!me) redirect('/kirish');
  return me;
}
