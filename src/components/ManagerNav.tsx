'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Store, LogOut, ClipboardList, Boxes, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export function ManagerNav() {
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
      label: locale === 'en' ? 'Overview' : 'Tổng Quan',
      href: '/manager',
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === '/manager',
    },
    {
      label: locale === 'en' ? 'Branch Orders' : 'Đơn Hàng Chi Nhánh',
      href: '/manager/orders',
      icon: <ClipboardList className="w-4 h-4" />,
      active: pathname.startsWith('/manager/orders'),
    },
    {
      label: locale === 'en' ? 'FEFO Inventory' : 'Kho Lô Hàng FEFO',
      href: '/manager/inventory',
      icon: <Boxes className="w-4 h-4" />,
      active: pathname.startsWith('/manager/inventory'),
    },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-6">
            <Link href="/manager" className="flex items-center gap-3 shrink-0">
              <img
                src={BRAND_ASSETS.logo}
                alt="COBI BREAD"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="hidden xl:block pl-3 border-l border-stone-200">
                <span className="text-sm font-bold text-[#231812] leading-tight block">
                  Manager Portal
                </span>
                <span className="text-[11px] text-[#6E5C50] font-medium">
                  {locale === 'en' ? 'Branch Operations' : 'Vận hành chi nhánh'}
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    item.active
                      ? 'bg-[#F37021] text-white shadow-xs'
                      : 'text-stone-600 hover:text-[#231812] hover:bg-stone-100'
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
            <div className="inline-flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
              <button
                type="button"
                onClick={() => setLocale('vi')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  locale === 'vi'
                    ? 'bg-[#231812] text-white'
                    : 'text-stone-500 hover:text-[#231812]'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#231812] text-white'
                    : 'text-stone-500 hover:text-[#231812]'
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#F37021]" />
              <span>{locale === 'en' ? 'Storefront' : 'Xem Cửa Hàng'}</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Sign Out' : 'Đăng xuất'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-100 text-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 font-bold ${
                item.active ? 'bg-[#F37021] text-white' : 'text-stone-600'
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
