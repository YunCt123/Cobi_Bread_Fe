'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useMounted } from '@/hooks/useMounted';
import { useTranslation } from '@/hooks/useTranslation';
import type { Role } from '@/types/user';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const { locale } = useTranslation();
  const { user, accessToken, isHydrated } = useAuthStore();

  const ready = mounted && isHydrated;

  useEffect(() => {
    if (!ready) return;
    if (!accessToken || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || '/admin')}`);
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 'ADMIN') router.replace('/admin');
      else if (user.role === 'BRANCH_MANAGER') router.replace('/manager');
      else router.replace('/');
    }
  }, [ready, accessToken, user, allowedRoles, router, pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F3EE]">
        <Loader2 className="h-7 w-7 animate-spin text-[#C67C3B]" />
      </div>
    );
  }

  if (!accessToken || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F6F3EE] p-6 text-center">
        <ShieldAlert className="h-10 w-10 text-[#C67C3B]" />
        <p className="text-sm font-semibold text-[#231812]">
          {locale === 'en'
            ? 'Verifying system access permissions...'
            : 'Đang kiểm tra quyền truy cập hệ thống...'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
