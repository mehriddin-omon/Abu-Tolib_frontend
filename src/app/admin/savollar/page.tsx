import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: "Savollar banki" };

export default function Page() {
  return (
    <>
      <PageHeader title="Savollar banki" />
      <ComingSoon step={2} what="Savollar dars kodiga bog'lanadi; variantlar, qiyinlik va CSV'dan ommaviy import." />
    </>
  );
}
