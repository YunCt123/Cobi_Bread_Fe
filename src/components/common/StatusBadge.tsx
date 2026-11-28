'use client';

import { ORDER_STATUS_STYLES, ROLE_BADGE_STYLES, STORAGE_BADGE_STYLES } from '@/constants/status';
import type { OrderStatus } from '@/types/order';
import type { StorageType } from '@/types/product';
import type { Role } from '@/types/auth';
import { cn } from '@/utils/cn';

interface StorageBadgeLabels {
  products?: {
    badgeFresh?: string;
    badgeFreshShort?: string;
    badgeFrozen?: string;
    badgeFrozenShort?: string;
    badgeAmbient?: string;
    badgeAmbientShort?: string;
  };
}

export function getStorageBadge(storageType: StorageType | string, t?: StorageBadgeLabels) {
  switch (storageType) {
    case 'FRESH':
      return {
        label: t?.products?.badgeFresh || 'Bánh tươi trong ngày',
        shortLabel: t?.products?.badgeFreshShort || 'Bánh tươi',
        bg: 'bg-[#FFF5EA] text-[#B86B2B] border-[#F0D5B8]',
        dot: 'bg-[#C67C3B]',
      };
    case 'FROZEN':
      return {
        label: t?.products?.badgeFrozen || 'Cấp đông (-18°C)',
        shortLabel: t?.products?.badgeFrozenShort || 'Cấp đông',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
      };
    default:
      return {
        label: t?.products?.badgeAmbient || 'Nhiệt độ phòng',
        shortLabel: t?.products?.badgeAmbientShort || 'Tiêu chuẩn',
        bg: 'bg-stone-100 text-stone-700 border-stone-200',
        dot: 'bg-stone-500',
      };
  }
}

interface StatusBadgeProps {
  variant?: 'order' | 'role' | 'storage' | 'custom';
  value: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant = 'custom', value, label, className }: StatusBadgeProps) {
  let colorClass = 'bg-stone-100 text-stone-700 border-stone-200';

  if (variant === 'order' && value in ORDER_STATUS_STYLES) {
    colorClass = ORDER_STATUS_STYLES[value as OrderStatus];
  } else if (variant === 'role' && value in ROLE_BADGE_STYLES) {
    colorClass = ROLE_BADGE_STYLES[value as Role];
  } else if (variant === 'storage' && value in STORAGE_BADGE_STYLES) {
    colorClass = STORAGE_BADGE_STYLES[value as StorageType];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        colorClass,
        className
      )}
    >
      {label || value}
    </span>
  );
}
