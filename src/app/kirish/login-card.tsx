'use client';

import { CheckCircle2, Loader2, RotateCw, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, ApiError } from '@/lib/api';
import { homeFor, type PollResult, type StartedLogin, type User } from '@/lib/types';

type Phase =
  | { kind: 'idle' }
  | { kind: 'starting' }
  | { kind: 'waiting'; login: StartedLogin }
  | { kind: 'done' }
  | { kind: 'expired' }
  | { kind: 'error'; message: string };

const POLL_MS = 2000;

export function LoginCard({ devLogin }: { devLogin: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(
    (user: User) => {
      setPhase({ kind: 'done' });
      const next = params.get('next');
      const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : null;
      const target =
        safeNext && !(safeNext.startsWith('/admin') && user.role !== 'ADMIN')
          ? safeNext
          : homeFor(user.role);
      router.replace(target);
      router.refresh();
    },
    [params, router],
  );

  useEffect(() => {
    if (phase.kind !== 'waiting') return;
    const { login } = phase;
    let stopped = false;

    const tick = async () => {
      try {
        const r = await api<PollResult>('/auth/telegram/poll', {
          method: 'POST',
          json: { requestId: login.requestId, pollSecret: login.pollSecret },
        });
        if (stopped) return;
        if (r.status === 'confirmed') return finish(r.user);
        if (r.status === 'expired' || new Date(login.expiresAt) < new Date()) {
          return setPhase({ kind: 'expired' });
        }
      } catch {
        /* tarmoq uzilishi — keyingi urinishda davom etadi */
      }
      if (!stopped) timer.current = setTimeout(tick, POLL_MS);
    };
    timer.current = setTimeout(tick, POLL_MS);

    return () => {
      stopped = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phase, finish]);

  async function start() {
    setPhase({ kind: 'starting' });
    // Safari bloklamasligi uchun oynani darhol, bosish ichida ochamiz
    const win = window.open('', '_blank');
    try {
      const login = await api<StartedLogin>('/auth/telegram/start', { method: 'POST' });
      if (!login.deepLink) {
        win?.close();
        setPhase({
          kind: 'error',
          message: "Telegram bot ulanmagan: backend .env faylida TELEGRAM_BOT_TOKEN ni tekshiring.",
        });
        return;
      }
      if (win) win.location.href = login.deepLink;
      else window.location.href = login.deepLink;
      setPhase({ kind: 'waiting', login });
    } catch (e) {
      win?.close();
      setPhase({ kind: 'error', message: e instanceof ApiError ? e.message : 'Server bilan aloqa yo\'q' });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Kirish</CardTitle>
        <CardDescription>Telegram orqali bir bosishda kiring yoki ro&apos;yxatdan o&apos;ting.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {(phase.kind === 'idle' || phase.kind === 'starting' || phase.kind === 'error') && (
          <>
            <Button size="lg" variant="brand" onClick={start} disabled={phase.kind === 'starting'}>
              {phase.kind === 'starting' ? <Loader2 className="animate-spin" /> : <Send />}
              Telegram orqali kirish
            </Button>
            {phase.kind === 'error' && (
              <p className="text-sm text-destructive" role="alert">
                {phase.message}
              </p>
            )}
          </>
        )}

        {phase.kind === 'waiting' && (
          <div className="grid gap-4">
            <ol className="grid gap-2 text-sm">
              <li className="flex gap-2">
                <Step n={1} /> Telegram ochildi — botda <b>Start</b> ni bosing.
              </li>
              <li className="flex gap-2">
                <Step n={2} /> Birinchi marta bo&apos;lsa, telefon raqamingizni yuboring.
              </li>
              <li className="flex gap-2">
                <Step n={3} /> Shu sahifaga qayting — u o&apos;zi ochiladi. Yoki botdagi «Saytga qaytish»
                tugmasini bosing.
              </li>
            </ol>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Telegramdan tasdiq kutilmoqda…
            </div>
            <Button variant="outline" asChild>
              <a href={phase.login.deepLink!} target="_blank" rel="noopener">
                Telegram ochilmadimi? Shu yerni bosing
              </a>
            </Button>
          </div>
        )}

        {phase.kind === 'expired' && (
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">
              Kutish vaqti tugadi. Qaytadan urinib ko&apos;ring.
            </p>
            <Button variant="brand" onClick={start}>
              <RotateCw /> Qayta urinish
            </Button>
          </div>
        )}

        {phase.kind === 'done' && (
          <div className="flex items-center gap-2 text-sm font-medium text-good">
            <CheckCircle2 className="size-5" /> Kirdingiz, sahifa ochilmoqda…
          </div>
        )}

        {devLogin && phase.kind !== 'done' && <DevLogin onDone={finish} />}
      </CardContent>
    </Card>
  );
}

function Step({ n }: { n: number }) {
  return (
    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft font-mono text-[11px] text-brand-ink">
      {n}
    </span>
  );
}

/** Faqat lokal ishlab chiqish: NEXT_PUBLIC_DEV_LOGIN=true */
function DevLogin({ onDone }: { onDone: (u: User) => void }) {
  const [phone, setPhone] = useState('998901234567');
  const [error, setError] = useState<string | null>(null);

  async function submit(role: 'STUDENT' | 'ADMIN') {
    setError(null);
    try {
      const r = await api<{ user: User }>('/auth/dev-login', {
        method: 'POST',
        json: { phone, role, firstName: role === 'ADMIN' ? 'Admin' : 'Talaba' },
      });
      onDone(r.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xato');
    }
  }

  return (
    <div className="grid gap-2 rounded-lg border border-dashed border-warn/60 bg-warn-soft/40 p-3">
      <span className="font-mono text-[11px] font-semibold tracking-wide text-warn">DEV LOGIN</span>
      <Label htmlFor="dev-phone" className="text-xs">
        Telefon
      </Label>
      <Input id="dev-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => submit('STUDENT')}>
          Talaba
        </Button>
        <Button size="sm" variant="outline" onClick={() => submit('ADMIN')}>
          Admin
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
