import { Check } from 'lucide-react';
import { MathMd } from '@/components/math/math-md';
import { Badge } from '@/components/ui/badge';
import { DIFFICULTY_LABEL, type Question } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Savolning ixcham ko'rinishi: matn, variantlar (to'g'risi belgilangan), teglar */
export function QuestionCard({
  q,
  index,
  actions,
  compact,
}: {
  q: Question;
  index?: number;
  actions?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        {index != null && <span className="mr-1 font-mono text-xs text-muted-foreground tabular-nums">{index}.</span>}
        <Badge variant="mono">{q.lessonCode}</Badge>
        <Badge variant={q.difficulty === 1 ? 'good' : q.difficulty === 2 ? 'warn' : 'brand'}>
          {DIFFICULTY_LABEL[q.difficulty]}
        </Badge>
        {q.type === 'NUMERIC' && <Badge variant="outline">son javob</Badge>}
        {q.source && <Badge variant="outline">{q.source}</Badge>}
        {!!q.usedInTests && <Badge variant="muted">{q.usedInTests} testda</Badge>}
        {actions && <div className="ml-auto flex gap-1">{actions}</div>}
      </div>

      <MathMd className="text-[15px]">{q.textMd}</MathMd>

      {q.type === 'SINGLE_CHOICE' ? (
        <ul className={cn('grid gap-1.5', !compact && 'sm:grid-cols-2')}>
          {q.options.map((o) => (
            <li
              key={o.label}
              className={cn(
                'flex items-start gap-2 rounded-lg border px-3 py-1.5 text-sm',
                o.isCorrect && 'border-good/40 bg-good-soft',
              )}
            >
              <span className={cn('font-mono text-xs leading-6 text-muted-foreground', o.isCorrect && 'text-good')}>
                {o.label}
              </span>
              <MathMd inline className="min-w-0 flex-1">
                {o.textMd}
              </MathMd>
              {o.isCorrect && <Check className="mt-1 size-4 shrink-0 text-good" />}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm">
          Javob: <span className="rounded-md bg-good-soft px-2 py-0.5 font-mono text-good">{q.answerText}</span>
        </div>
      )}

      {!compact && q.explanationMd && (
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer select-none">Yechim / izoh</summary>
          <MathMd className="mt-2 text-foreground">{q.explanationMd}</MathMd>
        </details>
      )}
    </div>
  );
}
