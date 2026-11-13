'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Download, FileUp, Loader2, TriangleAlert } from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import type { ImportResult } from '@/lib/types';

/** Excel'da ochiladigan namuna (nuqta-vergul — uz/ru Excel standarti) */
const SAMPLE = [
  'kod;qiyinlik;savol;A;B;C;D;javob;izoh;manba',
  'TENG-04;1;"$x^2 - 5x + 6 = 0$ tenglamaning ildizlari yig\'indisi?";5;-5;6;1;A;"Vyet: $x_1 + x_2 = 5$";',
  'TENG-04;2;"$x^2 - 9 = 0$ tenglamaning musbat ildizi";;;;;3;;DTM 2024',
  'SON-03;1;"EKUB(12; 18) = ?";2;3;6;9;C;;',
].join('\r\n');

function downloadSample() {
  const blob = new Blob(['﻿' + SAMPLE], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'savollar-namuna.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function ImportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');

  const check = useMutation({
    mutationFn: (dryRun: boolean) =>
      api<ImportResult>('/admin/questions/import', { method: 'POST', json: { csv, dryRun } }),
    onSuccess: (r) => {
      if (r.created) {
        qc.invalidateQueries({ queryKey: ['questions'] });
        qc.invalidateQueries({ queryKey: ['admin-sections'] });
      }
    },
  });
  const result = check.data;

  const reset = () => {
    setCsv('');
    setFileName('');
    check.reset();
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>CSV&apos;dan ommaviy import</DialogTitle>
          <DialogDescription>
            Excel&apos;da jadval tuzing va «CSV (разделители — точка с запятой)» yoki «CSV UTF-8» qilib saqlang. Avval
            tekshiriladi — bitta qatorda xato bo&apos;lsa ham hech narsa yozilmaydi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 rounded-lg bg-muted/60 p-3 text-[13px]">
          <div>
            <b>Ustunlar:</b> <code>kod</code> (TENG-04), <code>qiyinlik</code> (1–3), <code>savol</code>,{' '}
            <code>A</code>…<code>F</code> variantlar, <code>javob</code> (variant harfi yoki son), <code>izoh</code>,{' '}
            <code>manba</code>.
          </div>
          <div className="text-muted-foreground">
            Variant ustunlari bo&apos;sh bo&apos;lsa — savol «son javob» turida bo&apos;ladi. Formulalar{' '}
            <code>$...$</code> ichida.
          </div>
          <Button variant="outline" size="sm" className="justify-self-start" onClick={downloadSample}>
            <Download /> Namuna fayl
          </Button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            check.reset();
            setFileName(f.name);
            setCsv(await f.text());
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-sm text-muted-foreground hover:border-ring hover:text-foreground"
        >
          <FileUp className="size-5" />
          {fileName || 'CSV faylni tanlang'}
        </button>

        {check.isError && <p className="text-sm text-destructive">{check.error.message}</p>}

        {result && (
          <div className="grid gap-3">
            {result.created > 0 ? (
              <div className="flex items-center gap-2 rounded-lg bg-good-soft px-3 py-2 text-sm text-good">
                <CheckCircle2 className="size-4" /> {result.created} ta savol bankka qo&apos;shildi
              </div>
            ) : result.errors.length ? (
              <div className="flex items-center gap-2 rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">
                <TriangleAlert className="size-4" />
                {result.total} qatordan {result.errors.length} tasida xato — tuzatib, faylni qayta tanlang
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-ink">
                <CheckCircle2 className="size-4" /> {result.valid} ta savol tayyor — xato yo&apos;q
              </div>
            )}

            {Object.keys(result.byLesson).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(result.byLesson)
                  .sort()
                  .map(([code, n]) => (
                    <Badge key={code} variant="mono">
                      {code} · {n}
                    </Badge>
                  ))}
              </div>
            )}

            {result.errors.length > 0 && (
              <ul className="grid max-h-60 gap-1 overflow-y-auto rounded-lg border p-2 text-[13px]">
                {result.errors.map((e) => (
                  <li key={e.row} className="flex gap-2">
                    <span className="w-14 shrink-0 font-mono text-muted-foreground">{e.row}-qator</span>
                    <span className="text-destructive">{e.errors.join('; ')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <DialogFooter>
          {result?.created ? (
            <Button onClick={reset} variant="outline">
              Yana import
            </Button>
          ) : result && !result.errors.length ? (
            <Button variant="brand" disabled={check.isPending} onClick={() => check.mutate(false)}>
              {check.isPending && <Loader2 className="animate-spin" />}
              {result.valid} ta savolni yuklash
            </Button>
          ) : (
            <Button disabled={!csv || check.isPending} onClick={() => check.mutate(true)}>
              {check.isPending && <Loader2 className="animate-spin" />}
              Tekshirish
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
