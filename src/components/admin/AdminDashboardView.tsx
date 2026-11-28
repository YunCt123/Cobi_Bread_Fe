'use client';

import { useMounted } from '@/hooks/useMounted';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Award,
  Store,
  Boxes,
  ClipboardList,
} from 'lucide-react';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAuthStore } from '@/stores/auth.store';
import { analyticsApi } from '@/services';
import { formatVND, getStorageBadge } from '@/components/storefront/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

const PIE_COLORS = ['#F37021', '#231812', '#D97706', '#059669', '#0284C7', '#7C3AED'];

export function AdminDashboardView() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();
  const { locale } = useTranslation();

  const [days, setDays] = useState<7 | 30 | 90>(30);
  const mounted = useMounted();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(user.role === 'BRANCH_MANAGER' ? '/manager' : '/');
    }
  }, [isHydrated, user, router]);

  const {
    data: analytics,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admin-overview-analytics', days],
    queryFn: () => analyticsApi.getAdminOverview(days),
    enabled: Boolean(isHydrated && user?.role === 'ADMIN'),
  });

  if (!isHydrated || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-3 border-[#F37021] border-t-transparent animate-spin" />
      </div>
    );
  }

  const kpis = analytics?.kpis;
  const maxProductRev = Math.max(...(analytics?.topProducts.map((p) => p.revenue) || [1]), 1);

  return (
    <PortalShell roleMode="ADMIN">
      <div className="space-y-6">
        {/* Top Welcome & Period Filter Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#F37021] text-[11px] font-bold uppercase tracking-wider">
                COBI BREAD ENTERPRISE BI
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs font-medium text-stone-500">
                {locale === 'en' ? '5 Nationwide Branches' : 'Toàn hệ thống 5 chi nhánh'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] tracking-tight">
              {locale === 'en'
                ? `Welcome back, ${user.fullName}!`
                : `Tổng Quan Quản Trị — ${user.fullName}`}
            </h1>
            <p className="text-xs text-stone-500">
              {locale === 'en'
                ? 'Real-time revenue, branch performance, category mix, traffic conversion, and FEFO stock risk.'
                : 'Giám sát doanh thu, hiệu suất 5 chi nhánh, cơ cấu danh mục bánh, lưu lượng truy cập và cảnh báo lô hàng FEFO.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 7d | 30d | 90d Filter Pills */}
            <div className="inline-flex items-center bg-[#F8F7F4] p-1 rounded-xl border border-black/5">
              {([7, 30, 90] as const).map((d) => (
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-black/10 text-xs font-bold text-[#231812] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#F37021]' : ''}`} />
              <span>{locale === 'en' ? 'Refresh' : 'Làm mới'}</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Cards */}
        {isLoading || !kpis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-32 rounded-2xl bg-white border border-black/5 p-5 animate-pulse space-y-3"
              >
                <div className="h-3 w-24 bg-stone-200 rounded" />
                <div className="h-7 w-32 bg-stone-200 rounded" />
                <div className="h-3 w-20 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Total Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Total Revenue' : 'Tổng doanh thu'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F37021] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#231812] tabular-nums">
                  {formatVND(kpis.totalRevenue)}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3" />+{kpis.revenueGrowth}%{' '}
                  {locale === 'en' ? `vs prev ${days}d` : `so với ${days} ngày trước`}
                </span>
              </div>
            </div>

            {/* 2. Total Orders */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Total Orders' : 'Tổng đơn hàng'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#231812] tabular-nums">
                  {kpis.totalOrders.toLocaleString('vi-VN')}{' '}
                  <span className="text-xs font-semibold text-stone-500">
                    {locale === 'en' ? 'orders' : 'đơn'}
                  </span>
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <TrendingUp className="w-3 h-3" />+{kpis.ordersGrowth}%{' '}
                  {locale === 'en' ? 'order growth' : 'tăng trưởng đơn'}
                </span>
              </div>
            </div>

            {/* 3. Average Order Value (AOV) */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Avg. Order Value (AOV)' : 'Giá trị đơn TB (AOV)'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl font-black text-[#231812] tabular-nums">
                  {formatVND(kpis.aov)}
                </p>
                <span className="text-[11px] font-medium text-stone-500 mt-1 block">
                  {locale === 'en' ? 'Per completed order' : 'Trung bình mỗi đơn thành công'}
                </span>
              </div>
            </div>

            {/* 4. Traffic & Conversion Rate */}
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Visitors & Conv. Rate' : 'Truy cập & Chuyển đổi'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-black text-[#231812] tabular-nums">
                    {kpis.totalVisitors.toLocaleString('vi-VN')}
                  </p>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold">
                    CR {kpis.conversionRate}%
                  </span>
                </div>
                <span className="text-[11px] font-medium text-stone-500 mt-1 block">
                  {locale === 'en' ? 'Storefront unique sessions' : 'Lượt khách ghé Storefront'}
                </span>
              </div>
            </div>

            {/* 5. Expiring FEFO Batches */}
            <Link
              href="/admin/inventory"
              className="group bg-white hover:bg-red-50/30 rounded-2xl p-5 border border-black/5 hover:border-red-200 shadow-2xs flex flex-col justify-between gap-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  {locale === 'en' ? 'Near-Expiry Batches' : 'Lô cận date (≤ 48h)'}
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
                  <span>{locale === 'en' ? 'Inspect FEFO Stock' : 'Kiểm tra kho FEFO'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Row 1 of Charts: Area Chart (Daily Revenue) + Bar Chart (5 Branches Comparison) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Area Chart — Daily Revenue */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#231812]">
                  {locale === 'en'
                    ? `Daily Revenue Trend (${days} Days)`
                    : `Biểu Đồ Doanh Thu Theo Ngày (${days} ngày)`}
                </h2>
                <p className="text-xs text-stone-500">
                  {locale === 'en'
                    ? 'Net bakery revenue across all 5 stores (VND)'
                    : 'Tổng doanh thu bánh tươi & đông lạnh toàn hệ thống (VND)'}
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              {mounted && analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.dailyRevenue}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="cobiRevGrad" x1="0" y1="0" x2="0" y2="1">
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
                      tickFormatter={(v) => `${Math.round(Number(v) / 1000000)}M`}
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
                      fillOpacity={1}
                      fill="url(#cobiRevGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-stone-100 animate-pulse" />
              )}
            </div>
          </div>

          {/* Chart 2: Bar Chart — Branch Revenue & Orders Comparison */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#231812]">
                  {locale === 'en'
                    ? '5-Branch Revenue & Orders'
                    : 'So Sánh Doanh Thu & Đơn 5 Chi Nhánh'}
                </h2>
                <p className="text-xs text-stone-500">
                  {locale === 'en'
                    ? 'Performance breakdown across 5 Cobi Bread locations'
                    : 'Đối chiếu hiệu suất kinh doanh giữa 5 cửa hàng'}
                </p>
              </div>
              <Link
                href="/admin/branches"
                className="text-xs font-bold text-[#F37021] hover:underline"
              >
                {locale === 'en' ? 'Manage →' : 'Chi tiết →'}
              </Link>
            </div>

            <div className="h-72 w-full">
              {mounted && analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.branchComparison}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE6" />
                    <XAxis
                      dataKey="branchName"
                      tick={{ fontSize: 10, fill: '#57534E' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 10, fill: '#78716C' }}
                      tickFormatter={(v) => `${Math.round(Number(v) / 1000000)}M`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 10, fill: '#78716C' }}
                    />
                    <Tooltip
                      formatter={(val, name) => {
                        if (name === 'revenue' || name === 'Doanh thu' || name === 'Revenue') {
                          return [formatVND(Number(val)), locale === 'en' ? 'Revenue' : 'Doanh thu'];
                        }
                        return [
                          `${val} ${locale === 'en' ? 'orders' : 'đơn'}`,
                          locale === 'en' ? 'Orders' : 'Số đơn',
                        ];
                      }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name={locale === 'en' ? 'Revenue' : 'Doanh thu'}
                      fill="#F37021"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      name={locale === 'en' ? 'Orders' : 'Số đơn'}
                      fill="#231812"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-stone-100 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Row 2 of Charts: Donut Chart (Category Share) + Line Chart (Traffic vs Orders) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 3: Donut / Pie Chart — Revenue by Bakery Category */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#231812]">
                {locale === 'en'
                  ? 'Revenue Mix by Category'
                  : 'Cơ Cấu Doanh Thu Theo Danh Mục Bánh'}
              </h2>
              <p className="text-xs text-stone-500">
                {locale === 'en'
                  ? 'Share across Fresh Cream Bread, Pocket Toast & Frozen lines'
                  : 'Tỷ trọng đóng góp của các dòng bánh chủ lực'}
              </p>
            </div>

            <div className="h-72 w-full">
              {mounted && analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryRevenue}
                      dataKey="revenue"
                      nameKey={locale === 'en' ? 'nameEn' : 'name'}
                      cx="50%"
                      cy="48%"
                      innerRadius={56}
                      outerRadius={88}
                      paddingAngle={3}
                    >
                      {analytics.categoryRevenue.map((entry, idx) => (
                        <Cell key={entry.categoryId} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
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
                    <Legend
                      wrapperStyle={{ fontSize: '11px' }}
                      formatter={(value) => String(value ?? "")}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-stone-100 animate-pulse" />
              )}
            </div>
          </div>

          {/* Chart 4: Line Chart — Traffic Visitors & Orders */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#231812]">
                {locale === 'en'
                  ? 'Daily Storefront Traffic & Orders'
                  : 'Lưu Lượng Truy Cập (Traffic) & Số Đơn Hàng Theo Ngày'}
              </h2>
              <p className="text-xs text-stone-500">
                {locale === 'en'
                  ? 'Daily visitors vs completed orders conversion trend'
                  : 'Tương quan giữa số lượt khách truy cập và đơn đặt bánh thành công'}
              </p>
            </div>

            <div className="h-72 w-full">
              {mounted && analytics ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analytics.trafficSeries}
                    margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE6" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: '#78716C' }}
                      tickLine={false}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#78716C' }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: '#F37021' }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E7E5E4',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="visitors"
                      name={locale === 'en' ? 'Visitors (Traffic)' : 'Lượt truy cập'}
                      stroke="#231812"
                      strokeWidth={2.2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      name={locale === 'en' ? 'Orders' : 'Đơn hàng'}
                      stroke="#F37021"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-xl bg-stone-100 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Top 5 Best-Selling Products Table + Quick Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#231812]">
                  {locale === 'en'
                    ? 'Top 5 Best-Selling Bakery Products'
                    : 'Top 5 Sản Phẩm Bánh Bán Chạy Nhất'}
                </h2>
                <p className="text-xs text-stone-500">
                  {locale === 'en'
                    ? 'Ranked by revenue contribution in the selected period'
                    : 'Xếp hạng theo doanh thu và sản lượng tiêu thụ trong kỳ'}
                </p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-bold text-[#F37021] hover:underline"
              >
                {locale === 'en' ? 'All Products →' : 'Tất cả sản phẩm →'}
              </Link>
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
                      {locale === 'en' ? 'Units Sold' : 'Đã Bán'}
                    </th>
                    <th className="px-5 py-3 text-right">
                      {locale === 'en' ? 'Revenue' : 'Doanh Thu'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(analytics?.topProducts || []).map((prod, idx) => {
                    const badge = getStorageBadge(prod.storageType, locale);
                    const pct = Math.round((prod.revenue / maxProductRev) * 100);
                    return (
                      <tr key={prod.productId} className="hover:bg-stone-50/70">
                        <td className="px-5 py-3.5 font-mono font-bold text-[#F37021]">
                          0{idx + 1}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image || BRAND_ASSETS.heroImage}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[#231812] truncate">
                                {locale === 'en' && prod.nameEn ? prod.nameEn : prod.name}
                              </p>
                              <span className="text-[11px] font-mono text-stone-400">
                                {prod.sku}
                              </span>
                            </div>
                          </div>
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
                        <td className="px-5 py-3.5 text-right">
                          <div className="space-y-1">
                            <span className="font-black text-[#F37021] tabular-nums block">
                              {formatVND(prod.revenue)}
                            </span>
                            <div className="w-24 ml-auto h-1.5 rounded-full bg-stone-100 overflow-hidden">
                              <div
                                className="h-full bg-[#F37021] rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Quick Action Modules */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#231812]">
                {locale === 'en' ? 'Quick Operations Console' : 'Điều Hành Nhanh Hệ Thống'}
              </h3>

              <div className="space-y-2.5">
                <Link
                  href="/admin/orders"
                  className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F37021] flex items-center justify-center">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#231812]">
                        {locale === 'en' ? 'All-Branch Orders' : 'Quản Lý Đơn Hàng'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {locale === 'en'
                          ? 'Filter by branch & inspect timeline'
                          : 'Lọc theo 5 chi nhánh & xem timeline'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/admin/inventory"
                  className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                      <Boxes className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#231812]">
                        {locale === 'en' ? 'FEFO Batch Stock' : 'Kho Lô Hàng FEFO'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {locale === 'en'
                          ? 'Monitor expiry alerts & import batches'
                          : 'Giám sát hạn dùng & nhập lô bánh mới'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/admin/branches"
                  className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#231812]">
                        {locale === 'en' ? '5 Branch Locations' : 'Quản Lý 5 Chi Nhánh'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {locale === 'en'
                          ? 'Bilingual address, hours & status'
                          : 'Cập nhật song ngữ, giờ mở cửa, hotline'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/admin/users"
                  className="p-3.5 rounded-xl bg-[#F8F7F4] hover:bg-orange-50/70 border border-black/5 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#231812]">
                        {locale === 'en' ? 'Users & Branch Managers' : 'Tài Khoản & Manager'}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {locale === 'en'
                          ? 'Assign branch managers & access control'
                          : 'Tạo tài khoản Manager gán chi nhánh'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

export default AdminDashboardView;
