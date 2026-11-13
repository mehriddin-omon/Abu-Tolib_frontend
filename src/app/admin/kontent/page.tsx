import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { ContentTree } from './content-tree';

export const metadata: Metadata = { title: "Bo'lim va darslar" };

export default function Page() {
  return (
    <>
      <PageHeader
        title="Bo'lim va darslar"
        description="14 bo'lim × 12 dars. Dars kodlari muzlatilgan — savollar shu kodlarga bog'lanadi."
      />
      <ContentTree />
    </>
  );
}
