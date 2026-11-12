/**
 * Brauzer tomonidagi API mijoz. Cookie'lar avtomatik yuboriladi (bir domen).
 * 401 bo'lsa — bir marta /auth/refresh qilib, so'rovni qaytaradi.
 */
export const API_BASE = '/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
  }
}

let refreshing: Promise<boolean> | null = null;

async function refreshOnce(): Promise<boolean> {
  // Bir vaqtda kelgan bir nechta 401 — bitta refresh
  refreshing ??= fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => setTimeout(() => (refreshing = null), 0));
  return refreshing;
}

export async function api<T>(
  path: string,
  init: RequestInit & { json?: unknown; retry?: boolean } = {},
): Promise<T> {
  const { json, retry = true, headers, ...rest } = init;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      ...(json !== undefined ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (res.status === 401 && retry && !path.startsWith('/auth/')) {
    if (await refreshOnce()) return api<T>(path, { ...init, retry: false });
    if (typeof window !== 'undefined') {
      window.location.href = `/kirish?next=${encodeURIComponent(window.location.pathname)}`;
    }
  }

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => undefined);
    const raw = body && typeof body === 'object' && 'message' in body ? body.message : undefined;
    const msg = Array.isArray(raw) ? raw.join(', ') : raw ? String(raw) : res.statusText;
    throw new ApiError(res.status, msg, body);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
