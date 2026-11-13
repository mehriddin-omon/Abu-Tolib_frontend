'use client';

import { useQuery } from '@tanstack/react-query';
import { NativeSelect } from '@/components/ui/native-select';
import { api } from '@/lib/api';
import type { SectionTree } from '@/lib/types';

export function useSections() {
  return useQuery({
    queryKey: ['admin-sections'],
    queryFn: () => api<SectionTree[]>('/admin/sections'),
    staleTime: 60_000,
  });
}

/** Bo'limlar bo'yicha guruhlangan dars kodi tanlovi */
export function LessonPicker({
  value,
  onChange,
  allowEmpty,
  emptyLabel = 'Barcha darslar',
  sectionCode,
  id,
  className,
}: {
  value: string;
  onChange: (code: string) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
  /** Faqat shu bo'lim darslari */
  sectionCode?: string;
  id?: string;
  className?: string;
}) {
  const { data } = useSections();
  const sections = (data ?? []).filter((s) => !sectionCode || s.code === sectionCode);
  return (
    <NativeSelect id={id} className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty && <option value="">{emptyLabel}</option>}
      {!allowEmpty && !value && <option value="">Darsni tanlang</option>}
      {sections.map((s) => (
        <optgroup key={s.id} label={s.title}>
          {s.lessons.map((l) => (
            <option key={l.id} value={l.code}>
              {l.code} · {l.title}
            </option>
          ))}
        </optgroup>
      ))}
    </NativeSelect>
  );
}

export function SectionPicker({
  value,
  onChange,
  emptyLabel = "Barcha bo'limlar",
  by = 'code',
  id,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  emptyLabel?: string;
  /** Qiymat sifatida bo'lim kodi yoki id */
  by?: 'code' | 'id';
  id?: string;
  className?: string;
}) {
  const { data } = useSections();
  return (
    <NativeSelect id={id} className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{emptyLabel}</option>
      {(data ?? []).map((s) => (
        <option key={s.id} value={by === 'code' ? s.code : s.id}>
          {s.title}
        </option>
      ))}
    </NativeSelect>
  );
}
