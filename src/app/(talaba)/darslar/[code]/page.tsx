import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MathMd } from '@/components/math/math-md';
import { serverApi } from '@/lib/server-api';
import type { Lesson } from '@/lib/types';

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const lesson = await serverApi<Lesson>(`/lessons/${encodeURIComponent(code)}`);
  return { title: lesson?.title ?? 'Dars' };
}

export default async function Page({ params }: Props) {
  const { code } = await params;
  const lesson = await serverApi<Lesson>(`/lessons/${encodeURIComponent(code)}`);
  if (!lesson) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/darslar" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {lesson.section.title}
      </Link>
      <div className="mb-1 font-mono text-xs text-muted-foreground">{lesson.code}</div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
      <div className="rounded-xl border bg-card p-5 shadow-xs sm:p-7">
        {lesson.bodyMd ? (
          <MathMd>{lesson.bodyMd}</MathMd>
        ) : (
          <p className="text-muted-foreground">Konspekt tez orada qo&apos;shiladi.</p>
        )}
      </div>
    </article>
  );
}
