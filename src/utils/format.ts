import type { Locale } from '@/stores/language.store';

export function formatVND(price: number, locale: Locale = 'vi'): string {
  const safePrice = Number.isFinite(price) ? price : 0;
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'vi-VN').format(safePrice) + '₫';
}

export function formatCurrencyVND(price: number, locale: Locale = 'vi'): string {
  return formatVND(price, locale);
}

export function formatDateTime(iso: string, locale: Locale = 'vi'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(iso: string, locale: Locale = 'vi'): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function isBatchExpiringWithinHours(expiresAt: string, maxHours = 48): boolean {
  const expMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expMs)) return false;
  const nowMs = new Date().getTime();
  const diffHours = (expMs - nowMs) / (1000 * 60 * 60);
  return diffHours <= maxHours;
}

export function isDateWithinDays(isoDate: string, days: number): boolean {
  const createdMs = new Date(isoDate).getTime();
  if (Number.isNaN(createdMs)) return false;
  const cutoffMs = new Date().getTime() - days * 24 * 60 * 60 * 1000;
  return createdMs >= cutoffMs;
}
