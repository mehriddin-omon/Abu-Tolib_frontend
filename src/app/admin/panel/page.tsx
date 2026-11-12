import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { serverApi } from '@/lib/server-api';
import type { Paginated, User } from '@/lib/types';

export const metadata: Metadata = { title: 'Panel' };

const roadmap = [
  { step: 1, title: 'Poydevor', state: 'done' },
  { step: 2, title: 'Kontent va savollar banki', state: 'next' },
  { step: 3, title: 'Diagnostika — talaba MVP', state: 'todo' },
  { step: 4, title: 'Yozma ish va AI', state: 'todo' },
  { step: 5, title: 'Statistika va ishga tushirish', state: 'todo' },
] as const;

export default async function AdminPanel() {
  const students = await serverApi<Paginated<User>>('/users?size=1');
  const total = students?.total ?? 0;

  return (
    <>
      <PageHeader title="Panel" description="Platformaning umumiy holati." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/oquvchilar"
          className="rounded-xl border bg-card p-4 shadow-xs transition-colors hover:border-ring"
        >
          <div className="text-[13px] text-muted-foreground">Ro&apos;yxatdan o&apos;tgan o&apos;quvchilar</div>
          <div className="mt-1.5 text-3xl font-semibold tabular-nums">{total}</div>
        </Link>
        {['Darslar', 'Savollar', 'Yozma ishlar'].map((k) => (
          <div key={k} className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="text-[13px] text-muted-foreground">{k}</div>
            <div className="mt-1.5 text-3xl font-semibold text-muted-foreground/40">—</div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold">Loyiha rejasi</h2>
      <ol className="grid gap-2">
        {roadmap.map((r) => (
          <li key={r.step} className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm">
            <span className="grid size-7 place-items-center rounded-md bg-foreground font-display text-base text-background">
              {r.step}
            </span>
            <span className="font-medium">{r.title}</span>
            <span
              className={
                'ml-auto rounded-full px-2 text-xs leading-5 ' +
                (r.state === 'done'
                  ? 'bg-good-soft text-good'
                  : r.state === 'next'
                    ? 'bg-brand-soft text-brand-ink'
                    : 'bg-muted text-muted-foreground')
              }
            >
              {r.state === 'done' ? 'tayyor' : r.state === 'next' ? 'keyingi' : 'reja'}
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
