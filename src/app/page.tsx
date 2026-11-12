import { ArrowRight, Route, Target, Timer } from 'lucide-react';
import Link from 'next/link';
import { Brand } from '@/components/app/brand';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { Button } from '@/components/ui/button';

const points = [
  {
    icon: Target,
    title: 'Aniq tashxis',
    text: "Har savol aniq bitta darsga bog'langan. Natijada «matematika» emas, TENG-04 kabi aniq mavzu ko'rinadi.",
  },
  {
    icon: Route,
    title: 'Shaxsiy reja',
    text: "Zaif darslar tartib bilan qaytarish navbatiga tushadi — bilgan mavzularga vaqt ketmaydi.",
  },
  {
    icon: Timer,
    title: 'Yozma ish tahlili',
    text: "Daftardagi yechimni rasmga olib yuklaysiz — qaysi qadamda adashganingiz ko'rinadi.",
  },
];

export default function Landing() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between py-5">
        <Brand subtitle="Milliy sertifikat · matematika" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/kirish">Kirish</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center py-16">
        <p className="mb-4 inline-flex w-fit rounded-md bg-brand-soft px-2 py-0.5 font-mono text-xs text-brand-ink">
          14 bo&apos;lim · 168 dars
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Qaysi mavzuni qaytarish kerakligini{' '}
          <span className="font-display font-normal">aniq bilib oling</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Diagnostika testini ishlang — Abu Tolib zaif darslaringizni topadi va ularni qaysi tartibda
          o&apos;rganishni ko&apos;rsatadi.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="brand">
            <Link href="/kirish">
              Boshlash <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-3">
          {points.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border bg-card p-5 shadow-xs">
              <Icon className="size-5 text-brand" />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Abu Tolib
      </footer>
    </div>
  );
}
