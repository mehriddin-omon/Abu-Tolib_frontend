'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { SectionTree } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Dars uchun savollar maqsadi (bo'lim ≈ 100+ savol) */
const QUESTIONS_GOAL = 10;

export function ContentTree() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-sections'],
    queryFn: () => api<SectionTree[]>('/admin/sections'),
  });
  const [open, setOpen] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="grid gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  if (isError || !data) return <p className="text-destructive">Ro&apos;yxatni yuklab bo&apos;lmadi</p>;

  const all = data.flatMap((s) => s.lessons);
  const stats = [
    { k: 'Konspekt yozilgan', v: all.filter((l) => l.hasBody).length, of: all.length },
    { k: "E'lon qilingan", v: all.filter((l) => l.published).length, of: all.length },
    { k: 'Savollar', v: data.reduce((a, s) => a + s.questionCount, 0) },
  ];

  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.k} className="rounded-xl border bg-card p-4 shadow-xs">
            <div className="text-[13px] text-muted-foreground">{s.k}</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">
              {s.v}
              {s.of && <span className="text-base font-normal text-muted-foreground"> / {s.of}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2">
        {data.map((s) => {
          const isOpen = open === s.id;
          const written = s.lessons.filter((l) => l.hasBody).length;
          return (
            <div key={s.id} className="rounded-xl border bg-card shadow-xs">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <Badge variant="mono">{s.code}</Badge>
                <span className="font-medium">{s.title}</span>
                <span className="ml-auto hidden text-xs text-muted-foreground tabular-nums sm:inline">
                  {written}/12 konspekt · {s.questionCount} savol
                </span>
                <ChevronDown
                  className={cn('size-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
                />
              </button>
              {isOpen && (
                <ul className="border-t">
                  {s.lessons.map((l) => (
                    <li key={l.id} className="border-b last:border-b-0">
                      <Link
                        href={`/admin/kontent/${l.code}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent/60"
                      >
                        <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{l.code}</span>
                        <span className={cn('min-w-0 flex-1 truncate', l.isFinal && 'font-medium')}>{l.title}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          {l.hasBody ? (
                            <FileText className="size-4 text-good" aria-label="Konspekt bor" />
                          ) : (
                            <FileText className="size-4 text-muted-foreground/30" aria-label="Konspekt yo'q" />
                          )}
                          <Badge
                            variant={l.questionCount >= QUESTIONS_GOAL ? 'good' : l.questionCount ? 'warn' : 'muted'}
                            className="tabular-nums"
                          >
                            {l.questionCount} savol
                          </Badge>
                          {l.published ? (
                            <Badge variant="brand">
                              <Check className="size-3" /> ochiq
                            </Badge>
                          ) : (
                            <Badge variant="outline">qoralama</Badge>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
