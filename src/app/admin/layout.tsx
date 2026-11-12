import { redirect } from 'next/navigation';
import { AppShell, type NavGroup } from '@/components/app/app-shell';
import { requireUser } from '@/lib/server-api';

const groups: NavGroup[] = [
  {
    label: 'Umumiy',
    items: [
      { href: '/admin/panel', label: 'Panel', icon: 'home' },
      { href: '/admin/oquvchilar', label: "O'quvchilar", icon: 'users' },
      { href: '/admin/yozma', label: 'Yozma ishlar', icon: 'pen', soon: '4' },
    ],
  },
  {
    label: 'Kontent',
    items: [
      { href: '/admin/kontent', label: "Bo'lim va darslar", icon: 'layers', soon: '2' },
      { href: '/admin/savollar', label: 'Savollar banki', icon: 'db', soon: '2' },
      { href: '/admin/testlar', label: 'Testlar', icon: 'test', soon: '2' },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/bosh');
  return (
    <AppShell user={user} subtitle="Boshqaruv paneli" groups={groups}>
      {children}
    </AppShell>
  );
}
