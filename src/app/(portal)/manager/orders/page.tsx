'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ManagerNav } from '@/components/ManagerNav';
import OrdersManagementBoard from '@/components/portal/OrdersManagementBoard';

export default function ManagerOrdersPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?redirect=/manager/orders');
      return;
    }
    if (user.role === 'CUSTOMER') {
      router.push('/');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user || user.role === 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#F37021]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <ManagerNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersManagementBoard mode="MANAGER" branchName={user.branch?.name} />
      </main>
    </div>
  );
}
