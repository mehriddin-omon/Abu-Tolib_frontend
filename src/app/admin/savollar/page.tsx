import type { Metadata } from 'next';
import { QuestionBank } from './question-bank';

export const metadata: Metadata = { title: 'Savollar banki' };

export default async function Page({ searchParams }: { searchParams: Promise<{ lesson?: string }> }) {
  const { lesson } = await searchParams;
  return <QuestionBank initialLesson={lesson?.toUpperCase() ?? ''} />;
}
