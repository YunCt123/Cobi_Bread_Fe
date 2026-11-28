'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[#E8DFD1] bg-[#FAF6F0] px-2.5 py-0.5 text-xs font-semibold text-[#5C4D40]',
        className
      )}
    >
      {children}
    </span>
  );
}
