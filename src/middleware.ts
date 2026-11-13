import { decodeJwt } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Har sahifa so'rovida:
 *  1. Access token muddati tugagan, lekin refresh bor bo'lsa — backend'da yangilaydi
 *     va yangi cookie'larni ham brauzerga, ham shu so'rovning o'ziga qo'yadi.
 *  2. Kirmagan foydalanuvchini /kirish ga, talabani /admin dan /bosh ga yo'naltiradi.
 * Haqiqiy tekshiruv (imzo) backend'da — bu yerda faqat yo'naltirish uchun.
 */
const API_INTERNAL = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
const PUBLIC_PATHS = ['/', '/kirish'];
/** Kirgan-kirmaganidan qat'i nazar ochiladi (bot havolasi boshqa akkauntga ham kiritishi mumkin) */
const OPEN_PATHS = ['/kirish/telegram'];

type Role = 'STUDENT' | 'ADMIN';

function readAccess(token: string | undefined): { role: Role } | null {
  if (!token) return null;
  try {
    const { exp, role } = decodeJwt(token) as { exp?: number; role?: Role };
    if (!exp || exp * 1000 < Date.now() + 10_000 || !role) return null;
    return { role };
  } catch {
    return null;
  }
}

async function tryRefresh(rt: string) {
  try {
    const res = await fetch(`${API_INTERNAL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { cookie: `rt=${rt}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const setCookies = res.headers.getSetCookie();
    const at = setCookies.find((c) => c.startsWith('at='))?.split(';')[0].slice(3);
    const access = readAccess(at);
    return access ? { setCookies, role: access.role } : null;
  } catch {
    return null;
  }
}

const homeFor = (role: Role) => (role === 'ADMIN' ? '/admin/panel' : '/bosh');

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (OPEN_PATHS.includes(pathname)) return NextResponse.next();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  let role = readAccess(req.cookies.get('at')?.value)?.role ?? null;
  let setCookies: string[] = [];

  const rt = req.cookies.get('rt')?.value;
  if (!role && rt) {
    const refreshed = await tryRefresh(rt);
    if (refreshed) {
      role = refreshed.role;
      setCookies = refreshed.setCookies;
    }
  }

  let res: NextResponse;
  if (!role) {
    if (isPublic) res = NextResponse.next();
    else {
      const url = new URL('/kirish', req.url);
      url.searchParams.set('next', pathname + search);
      res = NextResponse.redirect(url);
      // Yaroqsiz refresh cookie'ni tozalaymiz
      if (rt) res.cookies.delete('rt');
    }
    return res;
  }

  if (isPublic) {
    res = NextResponse.redirect(new URL(homeFor(role), req.url));
  } else if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    res = NextResponse.redirect(new URL('/bosh', req.url));
  } else if (setCookies.length) {
    // Yangi cookie'lar shu so'rovdagi server komponentlarga ham ko'rinsin
    const headers = new Headers(req.headers);
    const fresh = new Map(
      req.cookies.getAll().map((c) => [c.name, c.value] as [string, string]),
    );
    for (const c of setCookies) {
      const [pair] = c.split(';');
      const i = pair.indexOf('=');
      fresh.set(pair.slice(0, i), pair.slice(i + 1));
    }
    headers.set('cookie', [...fresh].map(([k, v]) => `${k}=${v}`).join('; '));
    res = NextResponse.next({ request: { headers } });
  } else {
    res = NextResponse.next();
  }

  for (const c of setCookies) res.headers.append('set-cookie', c);
  return res;
}

export const config = {
  // API, statik fayllar va Next ichki yo'llari bundan mustasno
  matcher: ['/((?!api/|_next/|favicon.ico|icon|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt)$).*)'],
};
