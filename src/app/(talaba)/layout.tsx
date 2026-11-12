import { AppShell, type NavGroup } from '@/components/app/app-shell';
import { requireUser } from '@/lib/server-api';

const groups: NavGroup[] = [
  {
    label: "O'qish",
    items: [
      { href: '/bosh', label: 'Bosh panel', icon: 'home' },
      { href: '/darslar', label: 'Darslar', icon: 'layers', soon: '2' },
      { href: '/diagnostika', label: 'Diagnostika', icon: 'target', soon: '3' },
      { href: '/yozma', label: 'Yozma ish', icon: 'pen', soon: '4' },
    ],
  },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <AppShell user={user} subtitle="Milliy sertifikat · matematika" groups={groups}>
      {children}
    </AppShell>
  );
}
