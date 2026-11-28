'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#231812] text-white hover:bg-[#3A281E]',
    secondary: 'bg-[#C67C3B] text-white hover:bg-[#A86224]',
    outline: 'border border-[#E2D6C5] bg-white text-[#231812] hover:bg-[#FAF6F0]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-[#6E5D4F] hover:bg-[#FAF6F0] hover:text-[#231812]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
