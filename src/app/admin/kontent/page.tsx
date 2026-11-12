import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: "Bo'lim va darslar" };

export default function Page() {
  return (
    <>
      <PageHeader title="Bo'lim va darslar" />
      <ComingSoon step={2} what="14 bo'lim × 12 dars, dars kodlari va konspekt tahriri (Markdown + formulalar)." />
    </>
  );
}
