import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: "Testlar" };

export default function Page() {
  return (
    <>
      <PageHeader title="Testlar" />
      <ComingSoon step={2} what="Savollar bankidan diagnostika va bo'lim nazorati testlarini yig'ish." />
    </>
  );
}
