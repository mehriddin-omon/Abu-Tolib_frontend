import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { serverApi } from '@/lib/server-api';
import type { Paginated, Question, SectionTree, TestSummary, User } from '@/lib/types';

export const metadata: Metadata = { title: 'Panel' };

const roadmap = [
  { step: 1, title: 'Poydevor', state: 'done' },
  { step: 2, title: 'Kontent va savollar banki', state: 'done' },
  { step: 3, title: 'Diagnostika — talaba MVP', state: 'next' },
  { step: 4, title: 'Yozma ish va AI', state: 'todo' },
  { step: 5, title: 'Statistika va ishga tushirish', state: 'todo' },
] as const;

export default async function AdminPanel() {
  const [students, sections, questions, tests] = await Promise.all([
    serverApi<Paginated<User>>('/users?size=1'),
    serverApi<SectionTree[]>('/admin/sections'),
    serverApi<Paginated<Question>>('/admin/questions?size=1'),
    serverApi<TestSummary[]>('/admin/tests'),
  ]);
  const total = students?.total ?? 0;
  const lessons = sections?.flatMap((s) => s.lessons) ?? [];
  const cards = [
    {
      href: '/admin/kontent',
      k: 'Konspekt yozilgan darslar',
      v: lessons.filter((l) => l.hasBody).length,
      of: lessons.length,
    },
    { href: '/admin/savollar', k: 'Savollar banki', v: questions?.total ?? 0 },
    { href: '/admin/testlar', k: "E'lon qilingan testlar", v: tests?.filter((t) => t.published).length ?? 0 },
  ];

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
        {cards.map((c) => (
          <Link
            key={c.k}
            href={c.href}
            className="rounded-xl border bg-card p-4 shadow-xs transition-colors hover:border-ring"
          >
            <div className="text-[13px] text-muted-foreground">{c.k}</div>
            <div className="mt-1.5 text-3xl font-semibold tabular-nums">
              {c.v}
              {c.of ? <span className="text-base font-normal text-muted-foreground"> / {c.of}</span> : null}
            </div>
          </Link>
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
