'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Store, 
  Package, 
  Layers, 
  Building2, 
  LogOut, 
  ArrowLeft 
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    {
      label: '5 Chi Nhánh',
      href: '/admin',
      icon: <Store className="w-4 h-4" />,
      active: pathname === '/admin',
    },
    {
      label: 'Quản Lý Sản Phẩm',
      href: '/admin/products',
      icon: <Package className="w-4 h-4" />,
      active: pathname.startsWith('/admin/products'),
    },
    {
      label: 'Quản Lý Danh Mục',
      href: '/admin/categories',
      icon: <Layers className="w-4 h-4" />,
      active: pathname.startsWith('/admin/categories'),
    },
  ];

  return (
    <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white leading-tight block">
                  Cobi HQ Admin
                </span>
                <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                  Trung Tâm Quản Trị
                </span>
              </div>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Xem Cửa Hàng</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/80 border border-red-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-800 text-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 font-bold ${
                item.active ? 'bg-purple-600 text-white' : 'text-stone-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
