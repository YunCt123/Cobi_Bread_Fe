'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { PortalShell } from '@/components/layout/PortalShell';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <PortalShell roleMode="ADMIN">{children}</PortalShell>
    </RoleGuard>
  );
}
