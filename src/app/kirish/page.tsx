import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Brand } from '@/components/app/brand';
import { LoginCard } from './login-card';

export const metadata: Metadata = { title: 'Kirish' };

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/50 px-4 py-10">
      <div className="mb-6">
        <Brand subtitle="Milliy sertifikat · matematika" />
      </div>
      <Suspense>
        <LoginCard devLogin={process.env.NEXT_PUBLIC_DEV_LOGIN === 'true'} />
      </Suspense>
      <p className="mt-6 max-w-sm text-center text-xs text-muted-foreground">
        Kirish Telegram orqali — parol kerak emas. Telefon raqamingiz faqat sizni tanish uchun
        ishlatiladi.
      </p>
    </div>
  );
}
