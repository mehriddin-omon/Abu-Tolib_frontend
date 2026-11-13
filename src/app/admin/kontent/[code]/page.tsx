import type { Metadata } from 'next';
import { LessonEditor } from './lesson-editor';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return { title: code.toUpperCase() };
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <LessonEditor code={code.toUpperCase()} />;
}
