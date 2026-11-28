'use client';

import { RoleGuard } from '@/components/auth/RoleGuard';
import { PortalShell } from '@/components/layout/PortalShell';

export default function ManagerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['BRANCH_MANAGER', 'ADMIN']}>
      <PortalShell roleMode="MANAGER">{children}</PortalShell>
    </RoleGuard>
  );
}
