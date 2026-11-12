import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl">404</p>
        <p className="mt-2 text-muted-foreground">Bunday sahifa yo&apos;q.</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/">Bosh sahifa</Link>
        </Button>
      </div>
    </div>
  );
}
