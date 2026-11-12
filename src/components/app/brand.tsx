import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg bg-foreground font-display text-[21px] leading-none text-background',
        className,
      )}
      aria-hidden
    >
      A
    </div>
  );
}

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark />
      <div className="leading-tight">
        <div className="font-semibold tracking-tight">Abu Tolib</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}
