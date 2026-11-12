import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: 'Diagnostika' };

export default function Page() {
  return (
    <>
      <PageHeader title="Diagnostika" />
      <ComingSoon step={3} what="Test ishlaysiz, xato sababini belgilaysiz — natijada zaif darslar ro'yxati va qaytarish rejasi chiqadi." />
    </>
  );
}
