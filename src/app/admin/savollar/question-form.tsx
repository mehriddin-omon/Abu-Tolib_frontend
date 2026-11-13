'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { MathMd } from '@/components/math/math-md';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { DIFFICULTY_LABEL, type Question, type QuestionInput } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LessonPicker } from './lesson-picker';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

function emptyQuestion(lessonCode: string): QuestionInput {
  return {
    lessonCode,
    type: 'SINGLE_CHOICE',
    textMd: '',
    difficulty: 2,
    options: LABELS.slice(0, 4).map((label, i) => ({ label, textMd: '', isCorrect: i === 0 })),
    answerText: '',
    explanationMd: '',
    source: '',
  };
}

function fromQuestion(q: Question): QuestionInput {
  return {
    lessonCode: q.lessonCode,
    type: q.type,
    textMd: q.textMd,
    difficulty: q.difficulty,
    options: q.options.length
      ? q.options.map(({ label, textMd, isCorrect }) => ({ label, textMd, isCorrect }))
      : emptyQuestion('').options,
    answerText: q.answerText ?? '',
    explanationMd: q.explanationMd ?? '',
    source: q.source ?? '',
  };
}

/** Savol qo'shish/tahrirlash oynasi. `question` berilsa — tahrir. */
export function QuestionFormDialog({
  open,
  onOpenChange,
  question,
  defaultLesson,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  question?: Question | null;
  defaultLesson: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{question ? 'Savolni tahrirlash' : 'Yangi savol'}</DialogTitle>
        </DialogHeader>
        {open && (
          <QuestionForm
            key={question?.id ?? 'new'}
            question={question}
            defaultLesson={defaultLesson}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function QuestionForm({
  question,
  defaultLesson,
  onDone,
}: {
  question?: Question | null;
  defaultLesson: string;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const [v, setV] = useState<QuestionInput>(() => (question ? fromQuestion(question) : emptyQuestion(defaultLesson)));
  const [keepOpen, setKeepOpen] = useState(false);
  const set = <K extends keyof QuestionInput>(k: K, val: QuestionInput[K]) => setV((s) => ({ ...s, [k]: val }));

  const save = useMutation({
    mutationFn: () => {
      const payload: QuestionInput = {
        ...v,
        options: v.type === 'SINGLE_CHOICE' ? v.options.filter((o) => o.textMd.trim()) : [],
        answerText: v.type === 'NUMERIC' ? v.answerText : undefined,
        explanationMd: v.explanationMd?.trim() || undefined,
        source: v.source?.trim() || undefined,
      };
      return question
        ? api<Question>(`/admin/questions/${question.id}`, { method: 'PUT', json: payload })
        : api<Question>('/admin/questions', { method: 'POST', json: payload });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['questions'] });
      qc.invalidateQueries({ queryKey: ['admin-sections'] });
      if (keepOpen && !question) {
        // Ketma-ket kiritish: dars va qiyinlik saqlanadi
        setV((s) => ({ ...emptyQuestion(s.lessonCode), difficulty: s.difficulty, source: s.source }));
      } else onDone();
    },
  });

  const setOption = (i: number, patch: Partial<QuestionInput['options'][number]>) =>
    set(
      'options',
      v.options.map((o, j) =>
        j === i ? { ...o, ...patch } : patch.isCorrect ? { ...o, isCorrect: false } : o,
      ),
    );

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="grid gap-1.5">
          <Label htmlFor="q-lesson">Dars kodi</Label>
          <LessonPicker id="q-lesson" value={v.lessonCode} onChange={(c) => set('lessonCode', c)} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="q-type">Turi</Label>
          <NativeSelect
            id="q-type"
            value={v.type}
            onChange={(e) => set('type', e.target.value as QuestionInput['type'])}
          >
            <option value="SINGLE_CHOICE">Variantli</option>
            <option value="NUMERIC">Son javob</option>
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <span className="text-sm leading-none font-medium">Qiyinlik</span>
          <div className="flex h-9 rounded-lg border p-0.5">
            {([1, 2, 3] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => set('difficulty', d)}
                className={cn(
                  'rounded-md px-2.5 text-sm',
                  v.difficulty === d ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-accent',
                )}
              >
                {DIFFICULTY_LABEL[d]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="q-text">Savol matni</Label>
        <Textarea
          id="q-text"
          value={v.textMd}
          onChange={(e) => set('textMd', e.target.value)}
          className="min-h-24 font-mono text-[13px] md:text-[13px]"
          placeholder="$x^2 - 5x + 6 = 0$ tenglamaning ildizlari yig'indisini toping."
          required
        />
        {v.textMd.trim() && (
          <div className="rounded-lg bg-muted/60 px-3 py-2">
            <MathMd>{v.textMd}</MathMd>
          </div>
        )}
      </div>

      {v.type === 'SINGLE_CHOICE' ? (
        <fieldset className="grid gap-2">
          <legend className="mb-1.5 text-sm font-medium">Variantlar — to&apos;g&apos;risini belgilang</legend>
          {v.options.map((o, i) => (
            <div key={o.label} className="grid grid-cols-[auto_1fr] items-start gap-2">
              <label
                className={cn(
                  'flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 font-mono text-sm',
                  o.isCorrect && 'border-good/50 bg-good-soft text-good',
                )}
              >
                <input
                  type="radio"
                  name="correct"
                  checked={o.isCorrect}
                  onChange={() => setOption(i, { isCorrect: true })}
                  className="accent-[var(--good)]"
                />
                {o.label}
              </label>
              <div className="grid gap-1">
                <Input
                  value={o.textMd}
                  onChange={(e) => setOption(i, { textMd: e.target.value })}
                  placeholder={`${o.label} variant`}
                  className="font-mono text-[13px] md:text-[13px]"
                />
                {/\$/.test(o.textMd) && <MathMd inline className="px-1 text-sm">{o.textMd}</MathMd>}
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={v.options.length >= 6}
              onClick={() =>
                set('options', [...v.options, { label: LABELS[v.options.length], textMd: '', isCorrect: false }])
              }
            >
              <Plus /> Variant
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={v.options.length <= 2}
              onClick={() => set('options', v.options.slice(0, -1))}
            >
              <Minus /> Oxirgisini olib tashlash
            </Button>
          </div>
        </fieldset>
      ) : (
        <div className="grid max-w-xs gap-1.5">
          <Label htmlFor="q-answer">To&apos;g&apos;ri javob (son)</Label>
          <Input
            id="q-answer"
            inputMode="decimal"
            value={v.answerText}
            onChange={(e) => set('answerText', e.target.value)}
            placeholder="masalan 2.5 yoki -3"
          />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="grid gap-1.5">
          <Label htmlFor="q-expl">Yechim / izoh (ixtiyoriy)</Label>
          <Textarea
            id="q-expl"
            value={v.explanationMd}
            onChange={(e) => set('explanationMd', e.target.value)}
            className="min-h-16 font-mono text-[13px] md:text-[13px]"
          />
        </div>
        <div className="grid content-start gap-1.5">
          <Label htmlFor="q-src">Manba</Label>
          <Input id="q-src" value={v.source} onChange={(e) => set('source', e.target.value)} placeholder="DTM 2024" />
        </div>
      </div>

      {save.isError && <p className="text-sm text-destructive">{save.error.message}</p>}

      <DialogFooter className="items-center gap-3 sm:justify-between">
        {!question ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={keepOpen} onChange={(e) => setKeepOpen(e.target.checked)} />
            Saqlagach yana yangi savol
          </label>
        ) : (
          <span />
        )}
        <Button type="submit" variant="brand" disabled={save.isPending || !v.lessonCode}>
          {save.isPending && <Loader2 className="animate-spin" />}
          Saqlash
        </Button>
      </DialogFooter>
    </form>
  );
}
