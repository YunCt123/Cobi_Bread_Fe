'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { AdminNav } from '@/components/AdminNav';
import InventoryFefoBoard from '@/components/portal/InventoryFefoBoard';

export default function AdminInventoryPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?redirect=/admin/inventory');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(user.role === 'BRANCH_MANAGER' ? '/manager' : '/');
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#F37021]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <AdminNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InventoryFefoBoard mode="ADMIN" />
      </main>
    </div>
  );
}
