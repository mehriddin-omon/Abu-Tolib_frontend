'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { TEST_KIND_LABEL, type TestDetail, type TestKind, type TestSummary } from '@/lib/types';
import { SectionPicker } from '../savollar/lesson-picker';

export function TestsList() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tests'],
    queryFn: () => api<TestSummary[]>('/admin/tests'),
  });

  return (
    <>
      <PageHeader
        title="Testlar"
        description="Savollar bankidan yig'iladi: kirish diagnostikasi, bo'lim nazorati va mashq testlari."
        actions={
          <Button variant="brand" onClick={() => setOpen(true)}>
            <Plus /> Test
          </Button>
        }
      />
      <div className="overflow-x-auto rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomi</TableHead>
              <TableHead>Turi</TableHead>
              <TableHead>Bo&apos;lim</TableHead>
              <TableHead className="text-right">Savollar</TableHead>
              <TableHead className="text-right">Vaqt</TableHead>
              <TableHead className="text-right">Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-5" />
                  </TableCell>
                </TableRow>
              ))}
            {data?.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/testlar/${t.id}`} className="hover:underline">
                    {t.title}
                  </Link>
                </TableCell>
                <TableCell>{TEST_KIND_LABEL[t.kind]}</TableCell>
                <TableCell className="text-muted-foreground">{t.section?.title ?? '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{t.questionCount}</TableCell>
                <TableCell className="text-right tabular-nums">{t.timeLimitMin ? `${t.timeLimitMin} daq` : '—'}</TableCell>
                <TableCell className="text-right">
                  {t.published ? <Badge variant="brand">ochiq</Badge> : <Badge variant="outline">qoralama</Badge>}
                </TableCell>
              </TableRow>
            ))}
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Hali test yo&apos;q. Avval savollar bankini to&apos;ldiring, keyin test yarating.
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-destructive">
                  Ro&apos;yxatni yuklab bo&apos;lmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreateTestDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function CreateTestDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [kind, setKind] = useState<TestKind>('DIAGNOSTIC');
  const [title, setTitle] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [time, setTime] = useState('');

  const create = useMutation({
    mutationFn: () =>
      api<TestDetail>('/admin/tests', {
        method: 'POST',
        json: {
          kind,
          title: title.trim(),
          ...(sectionId ? { sectionId } : {}),
          ...(time ? { timeLimitMin: Number(time) } : {}),
        },
      }),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ['tests'] });
      router.push(`/admin/testlar/${t.id}`);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi test</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="t-kind">Turi</Label>
            <NativeSelect id="t-kind" value={kind} onChange={(e) => setKind(e.target.value as TestKind)}>
              {Object.entries(TEST_KIND_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="t-title">Nomi</Label>
            <Input
              id="t-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={kind === 'DIAGNOSTIC' ? 'Kirish diagnostikasi' : 'Tenglamalar — yakuniy nazorat'}
              required
              minLength={2}
            />
          </div>
          {kind !== 'DIAGNOSTIC' && (
            <div className="grid gap-1.5">
              <Label htmlFor="t-section">Bo&apos;lim{kind === 'SECTION_FINAL' && ' (majburiy)'}</Label>
              <SectionPicker
                id="t-section"
                by="id"
                value={sectionId}
                onChange={setSectionId}
                emptyLabel={kind === 'SECTION_FINAL' ? "Bo'limni tanlang" : "Hamma bo'limlar"}
              />
            </div>
          )}
          <div className="grid max-w-40 gap-1.5">
            <Label htmlFor="t-time">Vaqt (daqiqa)</Label>
            <Input
              id="t-time"
              type="number"
              min={1}
              max={300}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="cheklovsiz"
            />
          </div>
          {create.isError && <p className="text-sm text-destructive">{create.error.message}</p>}
          <DialogFooter>
            <Button
              type="submit"
              variant="brand"
              disabled={create.isPending || (kind === 'SECTION_FINAL' && !sectionId)}
            >
              {create.isPending && <Loader2 className="animate-spin" />}
              Yaratish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
