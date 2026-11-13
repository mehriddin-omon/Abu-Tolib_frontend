import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Brand } from '@/components/app/brand';
import { TelegramReturn } from './telegram-return';

export const metadata: Metadata = { title: 'Kirish' };

/** Bot xabaridagi «Saytga qaytish» tugmasi shu sahifani ochadi: /kirish/telegram?t=<token> */
export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/50 px-4 py-10">
      <div className="mb-6">
        <Brand subtitle="Milliy sertifikat · matematika" />
      </div>
      <Suspense>
        <TelegramReturn />
      </Suspense>
    </div>
  );
}
