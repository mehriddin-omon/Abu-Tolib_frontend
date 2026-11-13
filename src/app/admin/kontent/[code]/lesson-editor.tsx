'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Database, Eye, Loader2, Pencil, Save } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { MathMd } from '@/components/math/math-md';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { cn } from '@/lib/utils';

const TEMPLATE = `## Ta'rif

**Kvadrat tenglama** — $ax^2 + bx + c = 0$ ko'rinishidagi tenglama, bunda $a \\ne 0$.

## Formula

$$D = b^2 - 4ac, \\qquad x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}$$

## Namuna

1. $x^2 - 7x + 10 = 0$: $D = 9$, $x_1 = 5$, $x_2 = 2$

> **Tipik xato:** $D$ ni hisoblashda $c$ ning ishorasini unutish.
`;

export function LessonEditor({ code }: { code: string }) {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-lesson', code],
    queryFn: () => api<Lesson>(`/admin/lessons/${code}`),
  });

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [view, setView] = useState<'edit' | 'preview'>('edit'); // faqat telefonda

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setBody(data.bodyMd ?? '');
    }
  }, [data]);

  const dirty = !!data && (title !== data.title || body !== (data.bodyMd ?? ''));

  const save = useMutation({
    mutationFn: (patch: Partial<Pick<Lesson, 'title' | 'bodyMd' | 'published'>>) =>
      api<Lesson>(`/admin/lessons/${code}`, { method: 'PATCH', json: patch }),
    onSuccess: (lesson) => {
      qc.setQueryData(['admin-lesson', code], (old: Lesson | undefined) => (old ? { ...old, ...lesson } : old));
      qc.invalidateQueries({ queryKey: ['admin-sections'] });
    },
  });

  const doSave = useCallback(() => {
    if (dirty && !save.isPending) save.mutate({ title: title.trim(), bodyMd: body });
  }, [dirty, save, title, body]);

  // Ctrl/Cmd + S — saqlash
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        doSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doSave]);

  // Saqlanmagan o'zgarish bilan sahifadan chiqishda ogohlantirish
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !data) return <p className="text-destructive">Dars topilmadi: {code}</p>;

  return (
    <>
      <Link
        href="/admin/kontent"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {data.section.title}
      </Link>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-2">
            <Badge variant="mono" className="text-sm">
              {data.code}
            </Badge>
            {data.title}
          </span>
        }
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={`/admin/savollar?lesson=${data.code}`}>
                <Database /> Savollar
              </Link>
            </Button>
            <Button
              variant={data.published ? 'outline' : 'secondary'}
              disabled={save.isPending}
              onClick={() => save.mutate({ published: !data.published })}
            >
              {data.published ? 'Yashirish' : "E'lon qilish"}
            </Button>
            <Button variant="brand" disabled={!dirty || save.isPending} onClick={doSave}>
              {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
              Saqlash
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        {data.published ? <Badge variant="brand">Talabalarga ochiq</Badge> : <Badge variant="outline">Qoralama</Badge>}
        {data.isFinal && <Badge variant="warn">Yakuniy nazorat darsi</Badge>}
        <span className="text-muted-foreground">
          {dirty ? 'Saqlanmagan o‘zgarishlar bor · Ctrl+S' : 'Hammasi saqlangan'}
        </span>
        {save.isError && <span className="text-destructive">{save.error.message}</span>}
      </div>

      <div className="mb-4 grid max-w-xl gap-1.5">
        <Label htmlFor="title">Dars nomi</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Telefonda: tahrir / ko'rinish almashinuvi */}
      <div className="mb-2 flex gap-1 lg:hidden">
        <Button size="sm" variant={view === 'edit' ? 'secondary' : 'ghost'} onClick={() => setView('edit')}>
          <Pencil /> Tahrir
        </Button>
        <Button size="sm" variant={view === 'preview' ? 'secondary' : 'ghost'} onClick={() => setView('preview')}>
          <Eye /> Ko&apos;rinish
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className={cn('grid gap-1.5', view !== 'edit' && 'max-lg:hidden')}>
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Konspekt — Markdown + LaTeX</Label>
            {!body && (
              <button type="button" className="text-xs text-brand-ink underline" onClick={() => setBody(TEMPLATE)}>
                Namuna qo&apos;yish
              </button>
            )}
          </div>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
            className="min-h-[60vh] font-mono text-[13px] leading-relaxed md:text-[13px]"
            placeholder={'## Sarlavha\n\nMatn, $x^2$ — qator ichida, $$\\frac{a}{b}$$ — alohida qatorda'}
          />
          <p className="text-xs text-muted-foreground">
            <code>$...$</code> — qator ichidagi formula, <code>$$...$$</code> — alohida qator, <code>## </code> —
            sarlavha, <code>&gt; </code> — eslatma bloki.
          </p>
        </div>
        <div className={cn('grid content-start gap-1.5', view !== 'preview' && 'max-lg:hidden')}>
          <span className="text-sm font-medium">Talaba ko&apos;radigan ko&apos;rinish</span>
          <div className="min-h-[60vh] rounded-xl border bg-card p-5 shadow-xs lg:max-h-[75vh] lg:overflow-y-auto">
            {body.trim() ? (
              <MathMd>{body}</MathMd>
            ) : (
              <p className="text-sm text-muted-foreground">Konspekt hali yozilmagan.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
