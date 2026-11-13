import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 text-xs leading-5 font-medium',
  {
    variants: {
      variant: {
        muted: 'bg-muted text-muted-foreground',
        brand: 'bg-brand-soft text-brand-ink',
        good: 'bg-good-soft text-good',
        warn: 'bg-warn-soft text-warn',
        outline: 'border text-muted-foreground',
        mono: 'rounded-md bg-muted px-1.5 font-mono text-[11.5px] text-foreground',
      },
    },
    defaultVariants: { variant: 'muted' },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
