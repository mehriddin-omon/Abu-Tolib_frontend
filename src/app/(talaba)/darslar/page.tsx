import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: 'Darslar' };

export default function Page() {
  return (
    <>
      <PageHeader title="Darslar" />
      <ComingSoon step={2} what="14 bo'lim va 168 dars: konspekt, formulalar va mashqlar shu yerda bo'ladi." />
    </>
  );
}
