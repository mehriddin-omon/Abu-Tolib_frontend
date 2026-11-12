import type { Metadata } from 'next';
import { Layers, PenLine, Target } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { requireUser } from '@/lib/server-api';
import { ProfileForm } from './profile-form';

export const metadata: Metadata = { title: 'Bosh panel' };

const next = [
  { icon: Target, title: 'Boshlang\'ich diagnostika', text: '30 savol, 14 bo\'limdan. Zaif darslaringizni topadi.', step: 3 },
  { icon: Layers, title: 'Darslar', text: '14 bo\'lim × 12 dars: konspekt, misollar va mashqlar.', step: 2 },
  { icon: PenLine, title: 'Yozma ish', text: '30 daqiqada yeching, rasmga olib yuklang — AI tahlil qiladi.', step: 4 },
];

function greeting() {
  const h = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Tashkent' }).format(new Date()),
  );
  if (h < 11) return 'Xayrli tong';
  if (h < 18) return 'Xayrli kun';
  return 'Xayrli kech';
}

export default async function StudentHome() {
  const user = await requireUser();

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${user.firstName}`}
        description={
          user.profileComplete
            ? "Diagnostika testi tez orada ochiladi. Hozircha profilingiz tayyor."
            : "Boshlashdan oldin ikkita savol: nechanchi sinfdasiz va qancha ball olmoqchisiz?"
        }
      />

      {!user.profileComplete && (
        <div className="mb-6">
          <ProfileForm user={user} />
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        {next.map(({ icon: Icon, title, text, step }) => (
          <div key={title} className="rounded-xl border bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <Icon className="size-5 text-brand" />
              <span className="rounded-full bg-muted px-2 font-mono text-[11px] leading-5 text-muted-foreground">
                tez orada
              </span>
            </div>
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground/70">{step}-qadam</p>
          </div>
        ))}
      </div>
    </>
  );
}
