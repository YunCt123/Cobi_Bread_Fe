import { OrderStatus, Role, StorageType } from '@/types';

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  PAID: 'bg-sky-50 text-sky-800 border-sky-200',
  CONFIRMED: 'bg-blue-50 text-blue-800 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  SHIPPING: 'bg-orange-50 text-orange-800 border-orange-200',
  DELIVERED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export const ROLE_BADGE_STYLES: Record<Role, string> = {
  ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  BRANCH_MANAGER: 'bg-blue-100 text-blue-800 border-blue-200',
  CUSTOMER: 'bg-stone-100 text-stone-700 border-stone-200',
};

export const STORAGE_BADGE_STYLES: Record<StorageType, string> = {
  FRESH: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  FROZEN: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
  AMBIENT: 'bg-amber-50 text-amber-900 border-amber-200/80',
};

export const TIMELINE_ORDER_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'DELIVERED',
];
