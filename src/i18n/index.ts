'use client';

import { useEffect, useState } from 'react';
import { useLanguageStore, Locale } from '@/stores/language.store';
import { getCategoryDisplayName } from '@/data/cobi-content';
import { vi, Translations } from './vi';
import { en } from './en';

export type { Locale, Translations };

const dictionaries: Record<Locale, Translations> = {
  vi,
  en,
};

/**
 * Hydration-safe translation hook for Next.js App Router.
 * Always renders `'vi'` on SSR and initial client hydration frame to eliminate
 * hydration mismatches with localStorage, then seamlessly switches to persisted locale.
 */
export function useTranslation() {
  const storedLocale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const locale: Locale = mounted ? storedLocale : 'vi';
  const t = dictionaries[locale];

  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [mounted, locale]);

  return {
    t,
    locale,
    setLocale,
    isHydrated: mounted,
  };
}

export function getLocalizedField(
  viValue: string | null | undefined,
  enValue: string | null | undefined,
  locale: Locale,
  fallback = ''
): string {
  if (locale === 'en' && enValue && enValue.trim()) {
    return enValue;
  }
  return viValue || enValue || fallback;
}

export function getLocalizedProductName(
  product: { name?: string | null; nameEn?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!product) return 'Cobi Bread';
  return getLocalizedField(product.name, product.nameEn, locale, 'Cobi Bread');
}

export function getLocalizedProductDescription(
  product: { description?: string | null; descriptionEn?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!product) return '';
  return getLocalizedField(product.description, product.descriptionEn, locale, '');
}

export function getLocalizedProductIngredients(
  product: { ingredients?: string | null; ingredientsEn?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!product) return '';
  return getLocalizedField(product.ingredients, product.ingredientsEn, locale, '');
}

export function getLocalizedBranchName(
  branch: { name?: string | null; nameEn?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!branch) return 'Cobi Bread';
  return getLocalizedField(branch.name, branch.nameEn, locale, 'Cobi Bread');
}

export function getLocalizedBranchAddress(
  branch: { address?: string | null; addressEn?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!branch) return '';
  return getLocalizedField(branch.address, branch.addressEn, locale, '');
}

export function getLocalizedBranchCity(
  branch: { city?: string | null; cityEn?: string | null } | null | undefined,
  locale: Locale
): string {
  if (!branch) return '';
  return getLocalizedField(branch.city, branch.cityEn, locale, '');
}

export function getLocalizedCategoryName(
  category:
    | { slug?: string | null; name?: string | null; nameEn?: string | null }
    | null
    | undefined,
  locale: Locale,
  fallback = 'Cobi Bread'
): string {
  if (!category) return fallback;
  if (locale === 'en' && category.nameEn && category.nameEn.trim()) {
    return category.nameEn;
  }
  return getCategoryDisplayName(category.slug || undefined, category.name || fallback, locale);
}
