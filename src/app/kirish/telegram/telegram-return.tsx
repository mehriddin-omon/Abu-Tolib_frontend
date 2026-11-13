'use client';

import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api, ApiError } from '@/lib/api';
import { homeFor, type User } from '@/lib/types';

type State = { kind: 'loading' } | { kind: 'done'; user: User } | { kind: 'error'; message: string };

export function TelegramReturn() {
  const router = useRouter();
  const token = useSearchParams().get('t');
  const [state, setState] = useState<State>({ kind: 'loading' });
  const started = useRef(false); // StrictMode'da ikki marta yubormaslik uchun (token bir martalik)

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) {
      setState({ kind: 'error', message: "Havola to'liq emas." });
      return;
    }
    api<{ user: User }>('/auth/telegram/exchange', { method: 'POST', json: { token } })
      .then(({ user }) => {
        setState({ kind: 'done', user });
        // Tokenni manzil satridan olib tashlab, bosh sahifaga
        router.replace(homeFor(user.role));
        router.refresh();
      })
      .catch((e: unknown) =>
        setState({
          kind: 'error',
          message:
            e instanceof ApiError && e.status === 410
              ? "Havola eskirgan yoki allaqachon ishlatilgan. Botga qaytib /start bosing — yangi havola keladi."
              : e instanceof ApiError
                ? e.message
                : "Server bilan aloqa yo'q",
        }),
      );
  }, [token, router]);

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="grid gap-4 py-2">
        {state.kind === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Telegram orqali kirilmoqda…
          </div>
        )}
        {state.kind === 'done' && (
          <div className="flex items-center gap-2 text-sm font-medium text-good">
            <CheckCircle2 className="size-5" /> Xush kelibsiz, {state.user.firstName}! Sahifa ochilmoqda…
          </div>
        )}
        {state.kind === 'error' && (
          <>
            <div className="flex items-start gap-2 text-sm text-destructive">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" /> {state.message}
            </div>
            <Button variant="brand" asChild>
              <Link href="/kirish">Kirish sahifasiga</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
