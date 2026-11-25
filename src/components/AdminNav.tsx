'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Store,
  Package,
  Layers,
  LogOut,
  ClipboardList,
  Boxes,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { locale, setLocale } = useTranslation();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    {
      label: locale === 'en' ? '5 Branches' : '5 Chi Nhánh',
      href: '/admin',
      icon: <Store className="w-4 h-4" />,
      active: pathname === '/admin',
    },
    {
      label: locale === 'en' ? 'Orders' : 'Đơn Hàng',
      href: '/admin/orders',
      icon: <ClipboardList className="w-4 h-4" />,
      active: pathname.startsWith('/admin/orders'),
    },
    {
      label: locale === 'en' ? 'FEFO Inventory' : 'Kho FEFO',
      href: '/admin/inventory',
      icon: <Boxes className="w-4 h-4" />,
      active: pathname.startsWith('/admin/inventory'),
    },
    {
      label: locale === 'en' ? 'Products' : 'Sản Phẩm',
      href: '/admin/products',
      icon: <Package className="w-4 h-4" />,
      active: pathname.startsWith('/admin/products'),
    },
    {
      label: locale === 'en' ? 'Categories' : 'Danh Mục',
      href: '/admin/categories',
      icon: <Layers className="w-4 h-4" />,
      active: pathname.startsWith('/admin/categories'),
    },
  ];

  return (
    <header className="bg-[#1C1410] border-b border-[#3A2B22] sticky top-0 z-30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-5">
            <Link href="/admin" className="flex items-center gap-3 shrink-0">
              <img
                src={BRAND_ASSETS.logo}
                alt="COBI BREAD"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="hidden xl:block pl-3 border-l border-[#3A2B22]">
                <span className="text-sm font-bold text-white leading-tight block">
                  HQ Admin
                </span>
                <span className="text-[10px] text-[#F37021] font-semibold uppercase tracking-wider">
                  {locale === 'en' ? 'Operations Center' : 'Trung Tâm Quản Trị'}
                </span>
              </div>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    item.active
                      ? 'bg-[#F37021] text-white shadow-xs'
                      : 'text-[#D8CFC6] hover:text-white hover:bg-[#2E2119]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* VI | EN Toggle */}
            <div className="inline-flex items-center bg-[#2E2119] rounded-lg p-0.5 border border-[#3A2B22]">
              <button
                type="button"
                onClick={() => setLocale('vi')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  locale === 'vi' ? 'bg-[#F37021] text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  locale === 'en' ? 'bg-[#F37021] text-white' : 'text-stone-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EADFD5] bg-[#2E2119] hover:bg-[#3A2B22] transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#F37021]" />
              <span>{locale === 'en' ? 'Storefront' : 'Xem Cửa Hàng'}</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/80 border border-red-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Sign Out' : 'Đăng xuất'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#3A2B22] text-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 font-bold ${
                item.active ? 'bg-[#F37021] text-white' : 'text-[#D8CFC6]'
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
