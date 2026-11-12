import type { Metadata } from 'next';
import { ComingSoon, PageHeader } from '@/components/app/page-header';

export const metadata: Metadata = { title: "Yozma ishlar" };

export default function Page() {
  return (
    <>
      <PageHeader title="Yozma ishlar" />
      <ComingSoon step={4} what="Talabalar yuklagan yechimlar, AI bahosi va o'qituvchi tasdig'i." />
    </>
  );
}
