'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Shuffle, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeferredValue, useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { MathMd } from '@/components/math/math-md';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { TEST_KIND_LABEL, type Paginated, type Question, type TestDetail } from '@/lib/types';
import { LessonPicker } from '../../savollar/lesson-picker';
import { QuestionCard } from '../../savollar/question-card';

export function TestEditor({ id }: { id: string }) {
  const qc = useQueryClient();
  const router = useRouter();
  const key = ['test', id];
  const { data: t, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: () => api<TestDetail>(`/admin/tests/${id}`),
  });

  const onSaved = (next: TestDetail) => {
    qc.setQueryData(key, next);
    qc.invalidateQueries({ queryKey: ['tests'] });
  };

  const patch = useMutation({
    mutationFn: (body: Partial<Pick<TestDetail, 'title' | 'timeLimitMin' | 'published'>>) =>
      api<TestDetail>(`/admin/tests/${id}`, { method: 'PATCH', json: body }),
    onSuccess: onSaved,
  });
  const setQuestions = useMutation({
    mutationFn: (questionIds: string[]) =>
      api<TestDetail>(`/admin/tests/${id}/questions`, { method: 'PUT', json: { questionIds } }),
    onSuccess: onSaved,
  });
  const auto = useMutation({
    mutationFn: (count: number) => api<TestDetail>(`/admin/tests/${id}/auto`, { method: 'POST', json: { count } }),
    onSuccess: onSaved,
  });
  const remove = useMutation({
    mutationFn: () => api<void>(`/admin/tests/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tests'] });
      router.push('/admin/testlar');
    },
  });

  const [autoCount, setAutoCount] = useState('30');

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !t) return <p className="text-destructive">Test topilmadi</p>;

  const ids = t.questions.map((q) => q.id);
  const move = (i: number, d: -1 | 1) => {
    const next = [...ids];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setQuestions.mutate(next);
  };
  const error = patch.error ?? setQuestions.error ?? auto.error ?? remove.error;
  const busy = patch.isPending || setQuestions.isPending || auto.isPending;

  // Darslar bo'yicha qamrov: qaysi kodlardan nechta
  const coverage = Object.entries(
    t.questions.reduce<Record<string, number>>((a, q) => ({ ...a, [q.lessonCode]: (a[q.lessonCode] ?? 0) + 1 }), {}),
  ).sort();

  return (
    <>
      <Link
        href="/admin/testlar"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Testlar
      </Link>
      <PageHeader
        title={t.title}
        description={
          <>
            {TEST_KIND_LABEL[t.kind]}
            {t.section && ` · ${t.section.title}`} · {t.questions.length} savol
          </>
        }
        actions={
          <>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              disabled={remove.isPending}
              onClick={() => confirm("Test o'chirilsinmi?") && remove.mutate()}
            >
              <Trash2 /> O&apos;chirish
            </Button>
            <Button
              variant={t.published ? 'outline' : 'brand'}
              disabled={busy}
              onClick={() => patch.mutate({ published: !t.published })}
            >
              {t.published ? 'Yashirish' : "E'lon qilish"}
            </Button>
          </>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-xs">
            <div className="grid min-w-56 flex-1 gap-1.5">
              <Label htmlFor="title">Nomi</Label>
              <Input
                id="title"
                defaultValue={t.title}
                key={t.title}
                onBlur={(e) => e.target.value.trim() !== t.title && patch.mutate({ title: e.target.value.trim() })}
              />
            </div>
            <div className="grid w-32 gap-1.5">
              <Label htmlFor="time">Vaqt (daq)</Label>
              <Input
                id="time"
                type="number"
                min={1}
                max={300}
                defaultValue={t.timeLimitMin ?? ''}
                key={String(t.timeLimitMin)}
                placeholder="—"
                onBlur={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null;
                  if (v !== t.timeLimitMin) patch.mutate({ timeLimitMin: v });
                }}
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="grid w-24 gap-1.5">
                <Label htmlFor="auto">Savol soni</Label>
                <Input id="auto" type="number" min={1} max={100} value={autoCount} onChange={(e) => setAutoCount(e.target.value)} />
              </div>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  (!ids.length || confirm("Joriy savollar almashtiriladi. Davom etilsinmi?")) &&
                  auto.mutate(Number(autoCount) || 30)
                }
              >
                {auto.isPending ? <Loader2 className="animate-spin" /> : <Shuffle />}
                Avto yig&apos;ish
              </Button>
            </div>
          </div>

          {coverage.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {coverage.map(([code, n]) => (
                <Badge key={code} variant="mono">
                  {code}
                  {n > 1 && ` ×${n}`}
                </Badge>
              ))}
            </div>
          )}

          {t.questions.length === 0 && (
            <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
              Testda savol yo&apos;q. «Avto yig&apos;ish» bosing yoki o&apos;ngdagi bankdan qo&apos;shing.
            </div>
          )}
          {t.questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={i + 1}
              compact
              actions={
                <>
                  <Button size="icon" variant="ghost" className="size-8" aria-label="Yuqoriga" disabled={i === 0 || busy} onClick={() => move(i, -1)}>
                    <ArrowUp />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    aria-label="Pastga"
                    disabled={i === ids.length - 1 || busy}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    aria-label="Testdan olib tashlash"
                    disabled={busy}
                    onClick={() => setQuestions.mutate(ids.filter((x) => x !== q.id))}
                  >
                    <X />
                  </Button>
                </>
              }
            />
          ))}
        </div>

        <BankPicker
          sectionCode={t.section?.code}
          selected={new Set(ids)}
          disabled={busy}
          onAdd={(qid) => setQuestions.mutate([...ids, qid])}
        />
      </div>
    </>
  );
}

/** O'ng panel: bankdan savol qo'shish */
function BankPicker({
  sectionCode,
  selected,
  disabled,
  onAdd,
}: {
  sectionCode?: string;
  selected: Set<string>;
  disabled: boolean;
  onAdd: (id: string) => void;
}) {
  const [lesson, setLesson] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const q = useDeferredValue(search.trim());

  const params = new URLSearchParams({ size: '30' });
  if (lesson) params.set('lessonCode', lesson);
  else if (sectionCode) params.set('sectionCode', sectionCode);
  if (difficulty) params.set('difficulty', difficulty);
  if (q) params.set('search', q);

  const { data, isLoading } = useQuery({
    queryKey: ['questions', 'picker', params.toString()],
    queryFn: () => api<Paginated<Question>>(`/admin/questions?${params}`),
    placeholderData: keepPreviousData,
  });

  return (
    <aside className="grid gap-3 rounded-xl border bg-card p-4 shadow-xs xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:grid-rows-[auto_auto_minmax(0,1fr)]">
      <h2 className="text-sm font-semibold">Bankdan qo&apos;shish</h2>
      <div className="grid gap-2">
        <LessonPicker value={lesson} onChange={setLesson} allowEmpty sectionCode={sectionCode} />
        <div className="grid grid-cols-[120px_1fr] gap-2">
          <NativeSelect value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Qiyinlik</option>
            <option value="1">Oddiy</option>
            <option value="2">O&apos;rta</option>
            <option value="3">Qiyin</option>
          </NativeSelect>
          <Input placeholder="Qidirish" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <ul className="grid content-start gap-2 overflow-y-auto">
        {isLoading && <Skeleton className="h-24" />}
        {data?.items.map((item) => {
          const inTest = selected.has(item.id);
          return (
            <li key={item.id} className="flex items-start gap-2 rounded-lg border p-2.5 text-sm">
              <div className="min-w-0 flex-1">
                <div className="mb-1 font-mono text-[11px] text-muted-foreground">
                  {item.lessonCode} · {['', 'oddiy', "o'rta", 'qiyin'][item.difficulty]}
                </div>
                <MathMd inline className="line-clamp-3 break-words">
                  {item.textMd}
                </MathMd>
              </div>
              <Button
                size="icon"
                variant={inTest ? 'ghost' : 'outline'}
                className="size-8 shrink-0"
                disabled={inTest || disabled}
                aria-label="Testga qo'shish"
                onClick={() => onAdd(item.id)}
              >
                {inTest ? <span className="text-xs text-good">✓</span> : <Plus />}
              </Button>
            </li>
          );
        })}
        {data?.items.length === 0 && <li className="py-6 text-center text-muted-foreground">Mos savol yo&apos;q</li>}
      </ul>
    </aside>
  );
}
