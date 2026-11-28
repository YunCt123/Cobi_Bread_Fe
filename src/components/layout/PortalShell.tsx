'use client';

import { isBatchExpiringWithinHours } from '@/utils/format';
import { useMounted } from '@/hooks/useMounted';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  ClipboardList,
  Boxes,
  Package,
  Layers,
  Store,
  Users,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  LogOut,
  ExternalLink,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ordersApi, inventoryApi } from '@/services';
import { InventoryBatch, Order } from '@/types';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedBranchName,
  getLocalizedProductName,
} from '@/i18n';

interface PortalShellProps {
  roleMode: 'ADMIN' | 'MANAGER';
  children: React.ReactNode;
}

interface NavGroup {
  groupLabel: string;
  items: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    exact?: boolean;
    badgeCount?: number;
    badgeTone?: 'orange' | 'red';
  }>;
}

const PortalShellNestedContext = React.createContext<boolean>(false);

export function PortalShell({ roleMode, children }: PortalShellProps) {
  const isNested = React.useContext(PortalShellNestedContext);
  if (isNested) {
    return <>{children}</>;
  }
  return <PortalShellInner roleMode={roleMode}>{children}</PortalShellInner>;
}

function PortalShellInner({ roleMode, children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isHydrated } = useAuthStore();
  const { locale, setLocale } = useTranslation();

  const mounted = useMounted();
  const [rawCollapsed, setIsCollapsed] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? localStorage.getItem('cobi_portal_sidebar_collapsed') === 'true'
      : false
  );
  const isCollapsed = mounted ? rawCollapsed : false;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cobi_portal_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  // Realtime polling for sidebar badges & notification bell (every 15 seconds)
  const { data: liveOrders = [] } = useQuery<Order[]>({
    queryKey: ['portal-shell-orders', roleMode],
    queryFn: () => ordersApi.getAll(),
    enabled: Boolean(isHydrated && user),
    refetchInterval: 15000,
  });

  const { data: liveBatches = [] } = useQuery<InventoryBatch[]>({
    queryKey: ['portal-shell-batches', roleMode],
    queryFn: () => inventoryApi.getBatches(),
    enabled: Boolean(isHydrated && user),
    refetchInterval: 30000,
  });

  const pendingOrders = useMemo(
    () => liveOrders.filter((o) => o.status === 'PENDING'),
    [liveOrders]
  );

  const expiringSoonBatches = useMemo(
    () => liveBatches.filter((b) => isBatchExpiringWithinHours(b.expiresAt, 48)),
    [liveBatches]
  );

  const pendingOrdersCount = pendingOrders.length;
  const expiringSoonBatchesCount = expiringSoonBatches.length;
  const totalNotifCount = pendingOrdersCount + expiringSoonBatchesCount;

  const handleLogout = () => {
    logout();
    toast.success(
      locale === 'en' ? 'Signed out of Cobi Bread Portal' : 'Đã đăng xuất khỏi hệ thống quản trị'
    );
    router.push('/login');
  };

  const navGroups: NavGroup[] = useMemo(() => {
    if (roleMode === 'ADMIN') {
      return [
        {
          groupLabel: locale === 'en' ? 'Monitoring & Operations' : 'Giám Sát & Vận Hành',
          items: [
            {
              label: locale === 'en' ? 'Overview Dashboard' : 'Tổng Quan Hệ Thống',
              href: '/admin',
              icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
              exact: true,
            },
            {
              label: locale === 'en' ? 'Orders' : 'Đơn Hàng',
              href: '/admin/orders',
              icon: <ClipboardList className="w-4 h-4 shrink-0" />,
              badgeCount: pendingOrdersCount,
              badgeTone: 'orange',
            },
            {
              label: locale === 'en' ? 'FEFO Inventory' : 'Kho Lô FEFO',
              href: '/admin/inventory',
              icon: <Boxes className="w-4 h-4 shrink-0" />,
              badgeCount: expiringSoonBatchesCount,
              badgeTone: 'red',
            },
          ],
        },
        {
          groupLabel: locale === 'en' ? 'Catalog & Organization' : 'Danh Mục & Tổ Chức',
          items: [
            {
              label: locale === 'en' ? 'Products' : 'Sản Phẩm Bánh',
              href: '/admin/products',
              icon: <Package className="w-4 h-4 shrink-0" />,
            },
            {
              label: locale === 'en' ? 'Categories' : 'Danh Mục',
              href: '/admin/categories',
              icon: <Layers className="w-4 h-4 shrink-0" />,
            },
            {
              label: locale === 'en' ? '5 Branches' : '5 Chi Nhánh',
              href: '/admin/branches',
              icon: <Store className="w-4 h-4 shrink-0" />,
            },
            {
              label: locale === 'en' ? 'Users & Roles' : 'Tài Khoản & Phân Quyền',
              href: '/admin/users',
              icon: <Users className="w-4 h-4 shrink-0" />,
            },
          ],
        },
      ];
    }

    return [
      {
        groupLabel: locale === 'en' ? 'Branch Operations' : 'Vận Hành Chi Nhánh',
        items: [
          {
            label: locale === 'en' ? 'Branch Dashboard' : 'Tổng Quan Chi Nhánh',
            href: '/manager',
            icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
            exact: true,
          },
          {
            label: locale === 'en' ? 'Branch Orders' : 'Xử Lý Đơn Hàng',
            href: '/manager/orders',
            icon: <ClipboardList className="w-4 h-4 shrink-0" />,
            badgeCount: pendingOrdersCount,
            badgeTone: 'orange',
          },
          {
            label: locale === 'en' ? 'FEFO Batch Stock' : 'Kho Lô Hàng FEFO',
            href: '/manager/inventory',
            icon: <Boxes className="w-4 h-4 shrink-0" />,
            badgeCount: expiringSoonBatchesCount,
            badgeTone: 'red',
          },
        ],
      },
      {
        groupLabel: locale === 'en' ? 'Analytics & Export' : 'Báo Cáo & Xuất Dữ Liệu',
        items: [
          {
            label: locale === 'en' ? 'Performance & CSV' : 'Báo Cáo & Xuất CSV',
            href: '/manager/reports',
            icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
          },
        ],
      },
    ];
  }, [roleMode, locale, pendingOrdersCount, expiringSoonBatchesCount]);

  // Dynamic Breadcrumb calculation
  const breadcrumbs = useMemo(() => {
    const base =
      roleMode === 'ADMIN'
        ? { label: 'HQ Admin Portal', href: '/admin' }
        : { label: 'Branch Manager Portal', href: '/manager' };

    const activeItem = navGroups
      .flatMap((g) => g.items)
      .find((item) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href)
      );

    if (!activeItem || activeItem.href === base.href) {
      return [
        base,
        {
          label: locale === 'en' ? 'Overview Dashboard' : 'Bảng Điều Khiển Tổng Quan',
          href: base.href,
        },
      ];
    }

    return [base, { label: activeItem.label, href: activeItem.href }];
  }, [roleMode, navGroups, pathname, locale]);

  const isItemActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const renderSidebarContent = (mobile = false) => {
    const compact = !mobile && isCollapsed;

    return (
      <div className="flex flex-col h-full bg-[#1C1410] text-[#FAF7F2] select-none">
        {/* Top Brand Area */}
        <div
          className={`h-16 px-4 border-b border-white/10 flex items-center ${
            compact ? 'justify-center' : 'justify-between'
          }`}
        >
          <Link
            href={roleMode === 'ADMIN' ? '/admin' : '/manager'}
            onClick={() => mobile && setIsMobileOpen(false)}
            className="flex items-center gap-3 min-w-0"
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="COBI BREAD"
              className="h-8 w-auto object-contain shrink-0"
            />
            {!compact && (
              <div className="min-w-0 pl-2.5 border-l border-white/15">
                <span className="text-xs font-bold text-white tracking-tight block truncate">
                  {roleMode === 'ADMIN' ? 'COBI HQ ADMIN' : 'BRANCH PORTAL'}
                </span>
                <span className="text-[10px] font-semibold text-[#F37021] uppercase tracking-wider block truncate">
                  {roleMode === 'ADMIN'
                    ? locale === 'en'
                      ? 'Enterprise Console'
                      : 'Quản Trị Hệ Thống'
                    : user?.branch
                    ? getLocalizedBranchName(user.branch, locale)
                    : locale === 'en'
                    ? 'Branch Manager'
                    : 'Quản Lý Chi Nhánh'}
                </span>
              </div>
            )}
          </Link>

          {mobile && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close sidebar"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {!compact && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {group.groupLabel}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isItemActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => mobile && setIsMobileOpen(false)}
                      title={compact ? item.label : undefined}
                      className={`group relative flex items-center ${
                        compact ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
                      } rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-[#F37021] text-white shadow-sm shadow-[#F37021]/30'
                          : 'text-stone-300 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon}
                        {!compact && <span className="truncate">{item.label}</span>}
                      </div>

                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span
                          className={`${
                            compact
                              ? 'absolute -top-1 -right-1 w-4 h-4 text-[9px] flex items-center justify-center'
                              : 'px-2 py-0.5 text-[10px]'
                          } rounded-full font-black tabular-nums ${
                            active
                              ? 'bg-white text-[#231812]'
                              : item.badgeTone === 'red'
                              ? 'bg-red-500 text-white'
                              : 'bg-[#F37021] text-white'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Storefront Shortcut & Collapse Toggle */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            title={compact ? (locale === 'en' ? 'Open Storefront' : 'Xem Storefront') : undefined}
            className={`flex items-center ${
              compact ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
            } rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-stone-200 transition-colors`}
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-[#F37021] shrink-0" />
              {!compact && (
                <span>{locale === 'en' ? 'View Storefront' : 'Xem Trang Bán Hàng'}</span>
              )}
            </div>
            {!compact && <ExternalLink className="w-3.5 h-3.5 text-stone-400" />}
          </Link>

          {!mobile && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {compact ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>{locale === 'en' ? 'Collapse Sidebar' : 'Thu gọn thanh bên'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#231812] flex">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 sticky top-0 h-screen z-30 transition-all duration-200 ${
          isCollapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-black/5 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Drawer Button + Dynamic Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              {breadcrumbs.map((bc, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={bc.href + idx}>
                    {idx > 0 && <span className="text-stone-300">/</span>}
                    {isLast ? (
                      <span className="font-bold text-[#231812] truncate">{bc.label}</span>
                    ) : (
                      <Link
                        href={bc.href}
                        className="text-stone-500 hover:text-[#F37021] font-medium truncate hidden sm:inline"
                      >
                        {bc.label}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right: Language Switcher + Notification Bell + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* VI | EN Language Switcher */}
            <div
              className="inline-flex items-center bg-[#F8F7F4] rounded-xl p-0.5 border border-black/5"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => setLocale('vi')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  locale === 'vi'
                    ? 'bg-[#231812] text-white shadow-2xs'
                    : 'text-stone-500 hover:text-[#231812]'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  locale === 'en'
                    ? 'bg-[#231812] text-white shadow-2xs'
                    : 'text-stone-500 hover:text-[#231812]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsUserMenuOpen(false);
                }}
                aria-label="Notifications"
                className="relative p-2.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 text-stone-700 hover:text-[#F37021] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {totalNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#F37021] text-white text-[10px] font-black flex items-center justify-center tabular-nums">
                    {totalNotifCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-black/10 shadow-2xl z-40 overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-[#F8F7F4]">
                      <span className="text-xs font-bold text-[#231812]">
                        {locale === 'en' ? 'Realtime Alerts' : 'Thông Báo Vận Hành'}
                      </span>
                      <span className="text-[11px] font-semibold text-[#F37021]">
                        {totalNotifCount} {locale === 'en' ? 'items' : 'mục cần chú ý'}
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 text-xs">
                      {pendingOrders.slice(0, 4).map((o) => (
                        <Link
                          key={o.id}
                          href={roleMode === 'ADMIN' ? '/admin/orders' : '/manager/orders'}
                          onClick={() => setIsNotifOpen(false)}
                          className="p-3.5 hover:bg-orange-50/50 flex items-start gap-3 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F37021] flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#231812] truncate">
                              {locale === 'en'
                                ? `New Pending Order ${o.orderCode}`
                                : `Đơn mới chờ duyệt ${o.orderCode}`}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {o.shippingAddress?.recipientName} •{' '}
                              {new Intl.NumberFormat('vi-VN').format(o.totalAmount)} đ
                            </p>
                          </div>
                        </Link>
                      ))}

                      {expiringSoonBatches.slice(0, 4).map((b) => (
                        <Link
                          key={b.id}
                          href={roleMode === 'ADMIN' ? '/admin/inventory' : '/manager/inventory'}
                          onClick={() => setIsNotifOpen(false)}
                          className="p-3.5 hover:bg-red-50/50 flex items-start gap-3 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#231812] truncate">
                              {locale === 'en'
                                ? `FEFO Alert: ${b.batchCode}`
                                : `Lô cận date: ${b.batchCode}`}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate mt-0.5">
                              {b.product ? getLocalizedProductName(b.product, locale) : b.productId}{' '}
                              ({b.quantity} {locale === 'en' ? 'left' : 'cái'})
                            </p>
                          </div>
                        </Link>
                      ))}

                      {totalNotifCount === 0 && (
                        <div className="p-8 text-center text-stone-400">
                          {locale === 'en'
                            ? 'All orders & FEFO batches are healthy.'
                            : 'Không có đơn chờ hay lô hàng cận date.'}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#F8F7F4] hover:bg-stone-200/60 border border-black/5 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#231812] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-[#231812] leading-tight truncate max-w-[140px]">
                    {user?.fullName || 'Portal User'}
                  </p>
                  <p className="text-[10px] font-semibold text-[#F37021] uppercase leading-tight">
                    {user?.role === 'ADMIN' ? 'HQ ADMIN' : 'MANAGER'}
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-black/10 shadow-2xl z-40 py-2 text-xs">
                    <div className="px-4 py-2.5 border-b border-stone-100 space-y-1">
                      <p className="font-bold text-[#231812] truncate">{user?.fullName}</p>
                      <p className="text-stone-500 truncate">{user?.email}</p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-[#F37021] font-bold text-[10px]">
                          {user?.role === 'ADMIN' ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Building2 className="w-3 h-3" />
                          )}
                          {user?.role}
                        </span>
                        {user?.branch && (
                          <span className="text-[10px] font-semibold text-stone-600 truncate">
                            • {getLocalizedBranchName(user.branch, locale)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="px-4 py-2 hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 font-medium"
                      >
                        <Store className="w-4 h-4 text-[#F37021]" />
                        <span>
                          {locale === 'en' ? 'Back to Storefront' : 'Về Trang Chủ Bán Hàng'}
                        </span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2.5 text-red-600 font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{locale === 'en' ? 'Sign Out' : 'Đăng Xuất'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <PortalShellNestedContext.Provider value={true}>
            {children}
          </PortalShellNestedContext.Provider>
        </main>
      </div>
    </div>
  );
}
