'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#E8DFD1] bg-white p-5 shadow-xs',
        className
      )}
    >
      {children}
    </div>
  );
}
