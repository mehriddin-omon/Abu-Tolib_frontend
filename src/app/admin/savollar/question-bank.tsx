'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, FileUp, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import type { Paginated, Question } from '@/lib/types';
import { ImportDialog } from './import-dialog';
import { LessonPicker, SectionPicker } from './lesson-picker';
import { QuestionCard } from './question-card';
import { QuestionFormDialog } from './question-form';

const SIZE = 20;

export function QuestionBank({ initialLesson }: { initialLesson: string }) {
  const qc = useQueryClient();
  const [section, setSection] = useState(initialLesson.split('-')[0] ?? '');
  const [lesson, setLesson] = useState(initialLesson);
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const q = useDeferredValue(search.trim());

  const [editing, setEditing] = useState<Question | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const params = new URLSearchParams({ page: String(page), size: String(SIZE) });
  if (lesson) params.set('lessonCode', lesson);
  else if (section) params.set('sectionCode', section);
  if (difficulty) params.set('difficulty', difficulty);
  if (q) params.set('search', q);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['questions', params.toString()],
    queryFn: () => api<Paginated<Question>>(`/admin/questions?${params}`),
    placeholderData: keepPreviousData,
  });
  const pages = data ? Math.max(1, Math.ceil(data.total / SIZE)) : 1;

  const remove = useMutation({
    mutationFn: (id: string) => api<void>(`/admin/questions/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['questions'] });
      qc.invalidateQueries({ queryKey: ['admin-sections'] });
    },
    onError: (e) => alert(e.message),
  });

  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Savollar banki"
        description="Har savol bitta dars kodiga bog'lanadi — diagnostika xatoni shu dars orqali topadi."
        actions={
          <>
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <FileUp /> CSV import
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus /> Savol
            </Button>
          </>
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[200px_minmax(0,1fr)_140px_220px]">
        <SectionPicker
          value={section}
          onChange={resetPage((v: string) => {
            setSection(v);
            setLesson('');
          })}
        />
        <LessonPicker value={lesson} onChange={resetPage(setLesson)} allowEmpty sectionCode={section || undefined} />
        <NativeSelect value={difficulty} onChange={(e) => resetPage(setDifficulty)(e.target.value)}>
          <option value="">Qiyinlik</option>
          <option value="1">Oddiy</option>
          <option value="2">O&apos;rta</option>
          <option value="3">Qiyin</option>
        </NativeSelect>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Matn bo'yicha qidirish"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
          />
        </div>
      </div>

      {data && <p className="mb-3 text-sm text-muted-foreground tabular-nums">Topildi: {data.total}</p>}

      <div className="grid gap-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        {isError && <p className="text-destructive">Savollarni yuklab bo&apos;lmadi</p>}
        {data?.items.map((item, i) => (
          <QuestionCard
            key={item.id}
            q={item}
            index={(page - 1) * SIZE + i + 1}
            actions={
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label="Tahrirlash"
                  onClick={() => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                >
                  <Pencil />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  aria-label="O'chirish"
                  disabled={remove.isPending}
                  onClick={() => confirm("Savol o'chirilsinmi?") && remove.mutate(item.id)}
                >
                  <Trash2 />
                </Button>
              </>
            }
          />
        ))}
        {data && data.items.length === 0 && (
          <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
            {lesson || section || q || difficulty
              ? "Bu filtrga mos savol yo'q"
              : "Bank hali bo'sh — «Savol» yoki «CSV import» orqali qo'shing"}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground tabular-nums">
            {page} / {pages}
          </span>
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Oldingi">
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            aria-label="Keyingi"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <QuestionFormDialog open={formOpen} onOpenChange={setFormOpen} question={editing} defaultLesson={lesson} />
      <ImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </>
  );
}
