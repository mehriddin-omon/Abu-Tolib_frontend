'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, ApiError } from '@/lib/api';
import type { User } from '@/lib/types';

const GRADES = [9, 10, 11, 12];

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [grade, setGrade] = useState<number | null>(user.grade);
  const [target, setTarget] = useState(user.targetScore?.toString() ?? '');
  const [region, setRegion] = useState(user.region ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!grade) return setError('Sinfni tanlang');
    const targetScore = Number(target);
    if (!Number.isInteger(targetScore) || targetScore < 0 || targetScore > 100) {
      return setError('Maqsad ball 0 dan 100 gacha butun son bo\'lsin');
    }
    setSaving(true);
    setError(null);
    try {
      await api('/users/me', {
        method: 'PATCH',
        json: { grade, targetScore, ...(region.trim() ? { region: region.trim() } : {}) },
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Saqlab bo\'lmadi');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-xl border-brand/30 ring-4 ring-brand-soft">
      <CardHeader>
        <CardTitle>Profilni to&apos;ldiring</CardTitle>
        <CardDescription>Reja shu ma&apos;lumotga qarab tuziladi.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Sinf</Label>
            <div className="grid grid-cols-4 gap-2" role="radiogroup">
              {GRADES.map((g) => (
                <Button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={grade === g}
                  variant={grade === g ? 'default' : 'outline'}
                  onClick={() => setGrade(g)}
                >
                  {g === 12 ? 'Bitirgan' : `${g}-sinf`}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="target">Maqsad ball</Label>
              <Input
                id="target"
                inputMode="numeric"
                placeholder="masalan, 65"
                value={target}
                onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="region">Viloyat (ixtiyoriy)</Label>
              <Input
                id="region"
                placeholder="Navoiy"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" variant="brand" disabled={saving} className="justify-self-start">
            {saving && <Loader2 className="animate-spin" />} Saqlash
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
