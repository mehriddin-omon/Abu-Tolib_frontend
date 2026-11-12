import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { StudentsTable } from './students-table';

export const metadata: Metadata = { title: "O'quvchilar" };

export default function StudentsPage() {
  return (
    <>
      <PageHeader title="O'quvchilar" description="Telegram orqali ro'yxatdan o'tgan talabalar." />
      <StudentsTable />
    </>
  );
}
