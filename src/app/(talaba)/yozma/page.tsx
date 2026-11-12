import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: 'Yozma ish' };

export default function Page() {
  return (
    <>
      <PageHeader title="Yozma ish" />
      <ComingSoon step={4} what="Masalani 30 daqiqada daftarda yechib, rasmini yuklaysiz — AI ball va qadam-baqadam tahlil beradi." />
    </>
  );
}
