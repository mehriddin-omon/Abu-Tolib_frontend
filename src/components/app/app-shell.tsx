'use client';

import {
  BookOpen,
  ClipboardList,
  Database,
  FileCheck2,
  Home,
  Layers,
  LogOut,
  PenLine,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Brand } from '@/components/app/brand';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Server komponentdan uzatish uchun ikonka nomi (funksiya emas) */
const ICONS = {
  home: Home,
  layers: Layers,
  target: Target,
  pen: PenLine,
  users: Users,
  book: BookOpen,
  db: Database,
  test: ClipboardList,
  check: FileCheck2,
} satisfies Record<string, LucideIcon>;

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  /** Hali qurilmagan bo'lim: qaysi qadamda qo'shiladi */
  soon?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AppShell({
  user,
  subtitle,
  groups,
  children,
}: {
  user: User;
  subtitle: string;
  groups: NavGroup[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = `${user.firstName[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  async function logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
    router.replace('/kirish');
    router.refresh();
  }

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="flex flex-col border-b bg-sidebar px-3 py-3 md:sticky md:top-0 md:h-dvh md:border-r md:border-b-0 md:py-4">
        <div className="flex items-center justify-between px-2 pb-3 md:pb-5">
          <Brand subtitle={subtitle} />
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:block md:space-y-4 md:overflow-visible md:px-0">
          {groups.map((g) => (
            <div key={g.label} className="contents md:block">
              <div className="hidden px-2.5 pb-1.5 text-[11px] font-medium tracking-wider text-muted-foreground/70 uppercase md:block">
                {g.label}
              </div>
              {g.items.map((item) => {
                const Icon = ICONS[item.icon];
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground',
                      active && 'bg-card text-foreground shadow-xs ring-1 ring-border',
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                    {item.soon && (
                      <span className="ml-auto hidden rounded-full bg-border px-1.5 font-mono text-[10px] leading-[18px] text-muted-foreground md:inline">
                        {item.soon}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="mt-auto hidden items-center gap-2.5 border-t px-1 pt-3 md:flex">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-medium">
              {user.firstName} {user.lastName ?? ''}
            </div>
            <div className="text-xs text-muted-foreground">
              {user.role === 'ADMIN' ? "O'qituvchi · admin" : user.grade ? `${user.grade}-sinf` : 'Talaba'}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Chiqish" title="Chiqish">
            <LogOut />
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 hidden items-center justify-end gap-2 border-b bg-background/85 px-7 py-2.5 backdrop-blur md:flex">
          <ThemeToggle />
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-7 md:py-7">{children}</main>
        <div className="border-t px-4 py-4 md:hidden">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut /> Chiqish
          </Button>
        </div>
      </div>
    </div>
  );
}
