import { useLanguageStore, type Locale } from '@/stores/language.store';
import { vi } from '@/i18n/vi';
import { en } from '@/i18n/en';

export type TranslationDictionary = typeof vi;

const dictionaries: Record<Locale, TranslationDictionary> = {
  vi,
  en,
};

export function useTranslation() {
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);
  const t = dictionaries[locale] ?? vi;

  return {
    t,
    locale,
    setLocale,
  };
}
