import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { serverApi } from '@/lib/server-api';
import type { PublicSection } from '@/lib/types';

export const metadata: Metadata = { title: 'Darslar' };

export default async function Page() {
  const sections = (await serverApi<PublicSection[]>('/sections')) ?? [];
  const open = sections.filter((s) => s.lessons.length > 0);

  return (
    <>
      <PageHeader title="Darslar" description="Konspekt va formulalar. Yangi darslar bosqichma-bosqich ochiladi." />
      {open.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
          Hozircha ochiq dars yo&apos;q — tez orada qo&apos;shiladi.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {open.map((s) => (
            <section key={s.id} className="rounded-xl border bg-card shadow-xs">
              <h2 className="border-b px-4 py-3 font-medium">{s.title}</h2>
              <ul>
                {s.lessons.map((l) => (
                  <li key={l.id} className="border-b last:border-b-0">
                    <Link href={`/darslar/${l.code}`} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/60">
                      <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{l.code}</span>
                      <span className={l.isFinal ? 'font-medium' : ''}>{l.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
