'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronRight, Package, ShoppingBag, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from '@/hooks/useTranslation';

interface AccountShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AccountShell({ title, subtitle, actions, children }: AccountShellProps) {
  const { user } = useAuthStore();
  const { locale } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mb-5 flex items-center gap-2 text-xs text-[#8A7560]">
          <Link href="/" className="hover:text-[#C67C3B]">
            {locale === 'en' ? 'Home' : 'Trang chủ'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#231812]">{title}</span>
        </nav>

        <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-[#E8DFD1] bg-white p-6 shadow-xs sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF5EA] text-[#C67C3B]">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#231812]">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-[#6E5D4F]">{subtitle}</p>}
              {user && (
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#8A7560]">
                  <UserIcon className="h-3.5 w-3.5 text-[#C67C3B]" />
                  {user.fullName} ({user.email})
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {actions}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-[#231812] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3A281E]"
            >
              <ShoppingBag className="h-4 w-4 text-[#D99B52]" />
              {locale === 'en' ? 'Order More Bread' : 'Đặt thêm bánh'}
            </Link>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
