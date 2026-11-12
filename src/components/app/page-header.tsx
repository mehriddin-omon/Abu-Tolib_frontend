export function PageHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="ml-auto flex gap-2">{actions}</div>}
    </div>
  );
}

/** Hali qurilmagan bo'lim uchun */
export function ComingSoon({ step, what }: { step: number; what: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-card p-10 text-center">
      <span className="rounded-md bg-brand-soft px-2 py-0.5 font-mono text-xs text-brand-ink">
        {step}-qadam
      </span>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">{what}</p>
    </div>
  );
}
