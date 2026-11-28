'use client';

import { useMounted } from '@/hooks/useMounted';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  DollarSign,
  ClipboardList,
  Truck,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  FileSpreadsheet,
  Boxes,
} from 'lucide-react';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAuthStore } from '@/stores/auth.store';
import { branchesApi, authApi, analyticsApi } from '@/services';
import { Branch } from '@/types';
import { formatVND, getStorageBadge } from '@/components/storefront/ProductCard';
import {
  useTranslation,
  getLocalizedBranchName,
  getLocalizedBranchAddress,
} from '@/i18n';

const STORAGE_COLORS = ['#059669', '#0284C7', '#D97706'];

export function ManagerDashboardView() {
  const router = useRouter();
  const { user, isHydrated, updateUser } = useAuthStore();
  const { locale } = useTranslation();

  const [days, setDays] = useState<7 | 30>(7);
  const [branchDetails, setBranchDetails] = useState<Branch | null>(null);
  const mounted = useMounted();

  useEffect(() => {
    async function syncMeAndBranch() {
      if (!isHydrated) return;
      if (!user) {
        router.push('/login?redirect=/manager');
        return;
      }
      if (user.role === 'CUSTOMER') {
        router.push('/');
        return;
      }

      try {
        const me = await authApi.getMe();
        updateUser(me);
        if (me.branchId) {
          const b = await branchesApi.getBranchById(me.branchId, locale);
          setBranchDetails(b);
        }
      } catch {
        // Fallback to cached user.branch if offline
      }
    }
    syncMeAndBranch();
  }, [isHydrated, user, locale, router, updateUser]);

  const activeBranchId = branchDetails?.id || user?.branchId || undefined;

  const {
    data: analytics,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['branch-overview-analytics', days, activeBranchId],
    queryFn: () => analyticsApi.getBranchOverview(days, activeBranchId),
    enabled: Boolean(isHydrated && user && user.role !== 'CUSTOMER'),
  });

  if (!isHydrated || !user || user.role === 'CUSTOMER') {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-3 border-[#F37021] border-t-transparent animate-spin" />
      </div>
    );
  }

  const kpis = analytics?.kpis;
  const branchName = branchDetails
    ? getLocalizedBranchName(branchDetails, locale)
    : user.branch
    ? getLocalizedBranchName(user.branch, locale)
    : 'Cobi Bread Branch';

  return (
    <PortalShell roleMode="MANAGER">
      <div className="space-y-6">
        {/* Top Branch Banner + 7d/30d Switcher */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#F37021] text-[11px] font-bold uppercase tracking-wider">
                BRANCH OPERATIONS CONSOLE
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#231812]">
                <Store className="w-3.5 h-3.5 text-[#F37021]" />
                {branchName}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812]">
              {locale === 'en'
                ? `Branch Dashboard — ${user.fullName}`
                : `Bảng Điều Khiển Chi Nhánh — ${user.fullName}`}
            </h1>

            {(branchDetails || user.branch) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F37021]" />
                  {branchDetails
                    ? getLocalizedBranchAddress(branchDetails, locale)
                    : user.branch?.address}
                </span>
                {(branchDetails?.openHours || user.branch?.openHours) && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {branchDetails?.openHours || user.branch?.openHours}
                  </span>
                )}
                {(branchDetails?.phone || user.branch?.phone) && (
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#F37021]" />
                    {branchDetails?.phone || user.branch?.phone}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center bg-[#F8F7F4] p-1 rounded-xl border border-black/5">
              {([7, 30] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    days === d
                      ? 'bg-[#231812] text-white shadow-2xs'
                      : 'text-stone-600 hover:text-[#231812]'
                  }`}
                >
                  {d} {locale === 'en' ? 'Days' : 'ngày'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-black/10 text-xs font-bold text-[#231812] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#F37021]' : ''}`} />
              <span>{locale === 'en' ? 'Refresh' : 'Làm mới'}</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        {isLoading || !kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-32 rounded-2xl bg-white border border-black/5 p-5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Today's Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? "Today's Revenue" : 'Doanh thu hôm nay'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F37021] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#231812] tabular-nums">
                  {formatVND(kpis.todayRevenue)}
                </p>
                <span className="text-[11px] font-medium text-stone-500 mt-1 block">
                  {locale === 'en'
                    ? `${days}d total: ${formatVND(kpis.periodRevenue)}`
                    : `Tổng ${days} ngày: ${formatVND(kpis.periodRevenue)}`}
                </span>
              </div>
            </div>

            {/* 2. Pending Orders */}
            <Link
              href="/manager/orders"
              className="group bg-white hover:bg-orange-50/30 rounded-2xl p-5 border border-black/5 hover:border-[#F37021]/40 shadow-2xs flex flex-col justify-between gap-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Pending Approval' : 'Đơn chờ xác nhận'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#F37021] tabular-nums">
                  {kpis.pendingOrdersCount}{' '}
                  <span className="text-xs font-semibold">
                    {locale === 'en' ? 'orders' : 'đơn'}
                  </span>
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#231812] group-hover:text-[#F37021] mt-1">
                  <span>{locale === 'en' ? 'Approve now' : 'Xử lý duyệt đơn'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>

            {/* 3. Preparing / Shipping Orders */}
            <Link
              href="/manager/orders"
              className="group bg-white hover:bg-blue-50/30 rounded-2xl p-5 border border-black/5 shadow-2xs flex flex-col justify-between gap-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Preparing & Shipping' : 'Đơn đang làm / giao'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#231812] tabular-nums">
                  {kpis.shippingOrdersCount}{' '}
                  <span className="text-xs font-semibold text-stone-500">
                    {locale === 'en' ? 'active' : 'đơn đang chạy'}
                  </span>
                </p>
                <span className="text-[11px] font-medium text-emerald-700 mt-1 block">
                  {locale === 'en'
                    ? `${kpis.completedOrdersCount} delivered`
                    : `${kpis.completedOrdersCount} đơn đã hoàn tất`}
                </span>
              </div>
            </Link>

            {/* 4. Expiring FEFO Batches (<= 48h) */}
            <Link
              href="/manager/inventory"
              className="group bg-white hover:bg-red-50/30 rounded-2xl p-5 border border-black/5 hover:border-red-200 shadow-2xs flex flex-col justify-between gap-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Near-Expiry (≤ 48h)' : 'Lô cận date (≤ 48h)'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-red-600 tabular-nums">
                  {kpis.expiringBatchesCount}{' '}
                  <span className="text-xs font-semibold">
                    {locale === 'en' ? 'batches' : 'lô bánh'}
                  </span>
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F37021] group-hover:underline mt-1">
                  <span>{locale === 'en' ? 'Check FEFO table' : 'Kiểm tra kho FEFO'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Charts Row: Area Chart (Branch Daily Revenue) + Donut Chart (Fresh vs Frozen Mix) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Area Chart */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#231812]">
                  {locale === 'en'
                    ? `Branch Revenue Trend (${days} Days)`
                    : `Doanh Thu Chi Nhánh Theo Ngày (${days} ngày)`}
                </h2>
                <p className="text-xs text-stone-500">
                  {locale === 'en'
                    ? 'Daily sales revenue generated by this store'
                    : 'Biểu đồ doanh thu thực tế của riêng chi nhánh phụ trách'}
                </p>
              </div>
              <Link
                href="/manager/reports"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#F37021] hover:underline"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Export CSV →' : 'Xuất CSV →'}</span>
              </Link>
            </div>

            <div className="h-72 w-full">
              {mounted && analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.dailyRevenue}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="branchRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F37021" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#F37021" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE6" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#78716C' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#78716C' }}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(val) => [
                        formatVND(Number(val)),
                        locale === 'en' ? 'Revenue' : 'Doanh thu',
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#F37021"
                      strokeWidth={2.5}
                      fill="url(#branchRevGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-stone-100 animate-pulse" />
              )}
            </div>
          </div>

          {/* Donut Chart: Fresh 0-10°C vs Frozen -18°C vs Ambient */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#231812]">
                {locale === 'en'
                  ? 'Fresh (0-10°C) vs Frozen (-18°C) Mix'
                  : 'Tỷ Trọng Bánh Tươi (0-10°C) vs Đông Lạnh (-18°C)'}
              </h2>
              <p className="text-xs text-stone-500">
                {locale === 'en'
                  ? 'Revenue distribution by storage temperature condition'
                  : 'Phân bổ doanh thu theo điều kiện nhiệt độ bảo quản'}
              </p>
            </div>

            <div className="h-72 w-full">
              {mounted && analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.storageBreakdown}
                      dataKey="revenue"
                      nameKey={locale === 'en' ? 'labelEn' : 'labelVi'}
                      cx="50%"
                      cy="48%"
                      innerRadius={56}
                      outerRadius={86}
                      paddingAngle={4}
                    >
                      {analytics.storageBreakdown.map((entry, idx) => (
                        <Cell
                          key={entry.storageType}
                          fill={STORAGE_COLORS[idx % STORAGE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [
                        formatVND(Number(val)),
                        locale === 'en' ? 'Revenue' : 'Doanh thu',
                      ]}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-stone-100 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Top Products Sold at This Branch + Quick Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#231812]">
                  {locale === 'en'
                    ? 'Top-Selling Products at Branch'
                    : 'Sản Phẩm Bán Chạy Tại Chi Nhánh'}
                </h2>
                <p className="text-xs text-stone-500">
                  {locale === 'en'
                    ? 'Leading bakery items ordered from this location'
                    : 'Các dòng bánh có sản lượng xuất kho cao nhất tại cửa hàng'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8F7F4] text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200/70">
                  <tr>
                    <th className="px-5 py-3">#</th>
                    <th className="px-5 py-3">
                      {locale === 'en' ? 'Product' : 'Sản Phẩm'}
                    </th>
                    <th className="px-5 py-3">
                      {locale === 'en' ? 'Storage' : 'Bảo Quản'}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {locale === 'en' ? 'Units Sold' : 'Số Lượng Bán'}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {locale === 'en' ? 'Revenue' : 'Doanh Thu'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(analytics?.topProducts || []).map((prod, idx) => {
                    const badge = getStorageBadge(prod.storageType, locale);
                    return (
                      <tr key={prod.productId} className="hover:bg-stone-50/70">
                        <td className="px-5 py-3.5 font-mono font-bold text-[#F37021]">
                          0{idx + 1}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-[#231812]">
                            {locale === 'en' && prod.nameEn ? prod.nameEn : prod.name}
                          </p>
                          <span className="text-[11px] font-mono text-stone-400">
                            {prod.sku}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.className}`}
                          >
                            {badge.icon}
                            {badge.shortLabel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold tabular-nums text-[#231812]">
                          {prod.unitsSold.toLocaleString('vi-VN')}
                        </td>
                        <td className="px-5 py-3.5 text-right font-black text-[#F37021] tabular-nums">
                          {formatVND(prod.revenue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Branch Operations Cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#231812]">
                {locale === 'en' ? 'Branch Daily Workflow' : 'Tác Vụ Ca Trực Chi Nhánh'}
              </h3>

              <Link
                href="/manager/orders"
                className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F37021] flex items-center justify-center">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#231812]">
                      {locale === 'en' ? 'Process Branch Orders' : 'Duyệt & In Phiếu Đơn Hàng'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {locale === 'en'
                        ? '1-click transitions & packing slip'
                        : 'Chuyển trạng thái 1-click & in phiếu'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </Link>

              <Link
                href="/manager/inventory"
                className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#231812]">
                      {locale === 'en' ? 'FEFO Batch Inventory' : 'Nhập Lô Bánh & Kiểm Date'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {locale === 'en'
                        ? 'Red/Yellow/Green FEFO alerts'
                        : 'Cảnh báo Đỏ/Vàng/Xanh & nhập lô mới'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </Link>

              <Link
                href="/manager/reports"
                className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#231812]">
                      {locale === 'en' ? 'Branch Reports & CSV' : 'Báo Cáo Doanh Thu & Xuất CSV'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {locale === 'en'
                        ? 'Download Excel-ready CSV reports'
                        : 'Tải bảng đối soát đơn hàng & doanh thu'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

export default ManagerDashboardView;
