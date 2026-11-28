import type { StorageType } from './product';

export interface AdminOverviewAnalytics {
  days: number;
  kpis: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    aov: number;
    totalVisitors: number;
    conversionRate: number;
    expiringBatchesCount: number;
    expiredBatchesCount: number;
  };
  dailyRevenue: Array<{
    date: string;
    label: string;
    revenue: number;
    orders: number;
  }>;
  branchComparison: Array<{
    branchId: string;
    branchName: string;
    branchNameEn?: string | null;
    city?: string;
    revenue: number;
    orders: number;
  }>;
  categoryRevenue: Array<{
    categoryId: string;
    name: string;
    nameEn?: string | null;
    revenue: number;
    percentage: number;
  }>;
  trafficSeries: Array<{
    date: string;
    label: string;
    visitors: number;
    orders: number;
  }>;
  topProducts: Array<{
    productId: string;
    sku: string;
    name: string;
    nameEn?: string | null;
    storageType: StorageType;
    unitsSold: number;
    revenue: number;
    image?: string;
  }>;
}

export interface BranchOverviewAnalytics {
  days: number;
  branchId?: string;
  branchName?: string;
  kpis: {
    todayRevenue: number;
    periodRevenue: number;
    pendingOrdersCount: number;
    shippingOrdersCount: number;
    completedOrdersCount: number;
    expiringBatchesCount: number;
  };
  dailyRevenue: Array<{
    date: string;
    label: string;
    revenue: number;
    orders: number;
  }>;
  storageBreakdown: Array<{
    storageType: StorageType;
    labelVi: string;
    labelEn: string;
    revenue: number;
    units: number;
    percentage: number;
  }>;
  topProducts: Array<{
    productId: string;
    sku: string;
    name: string;
    nameEn?: string | null;
    storageType: StorageType;
    unitsSold: number;
    revenue: number;
  }>;
}

export type AdminOverviewStats = AdminOverviewAnalytics;
export type BranchOverviewStats = BranchOverviewAnalytics;
