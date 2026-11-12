'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import type { Paginated, User } from '@/lib/types';

const SIZE = 20;

function formatPhone(p: string | null) {
  if (!p) return '—';
  const m = p.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+998 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : `+${p}`;
}

export function StudentsTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const q = useDeferredValue(search.trim());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['students', q, page],
    queryFn: () =>
      api<Paginated<User>>(
        `/users?${new URLSearchParams({ page: String(page), size: String(SIZE), ...(q ? { search: q } : {}) })}`,
      ),
    placeholderData: keepPreviousData,
  });

  const pages = data ? Math.max(1, Math.ceil(data.total / SIZE)) : 1;

  return (
    <div className="rounded-xl border bg-card shadow-xs">
      <div className="flex items-center gap-3 border-b p-3">
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Ism yoki telefon"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {data && (
          <span className="ml-auto text-sm text-muted-foreground tabular-nums">Jami: {data.total}</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ism</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Sinf</TableHead>
              <TableHead>Viloyat</TableHead>
              <TableHead className="text-right">Maqsad ball</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {data?.items.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.firstName} {u.lastName ?? ''}
                  {u.username && <span className="ml-1.5 text-xs text-muted-foreground">@{u.username}</span>}
                </TableCell>
                <TableCell className="font-mono text-[13px]">{formatPhone(u.phone)}</TableCell>
                <TableCell>{u.grade ? (u.grade === 12 ? 'Bitirgan' : `${u.grade}-sinf`) : '—'}</TableCell>
                <TableCell>{u.region ?? '—'}</TableCell>
                <TableCell className="text-right tabular-nums">{u.targetScore ?? '—'}</TableCell>
              </TableRow>
            ))}
            {data && data.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {q ? 'Hech kim topilmadi' : "Hali hech kim ro'yxatdan o'tmagan"}
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-destructive">
                  Ro&apos;yxatni yuklab bo&apos;lmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-end gap-2 border-t p-3 text-sm">
          <span className="text-muted-foreground tabular-nums">
            {page} / {pages}
          </span>
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Oldingi">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Keyingi">
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
