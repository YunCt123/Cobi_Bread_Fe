import { vi } from './vi';
export { vi } from './vi';
export { en } from './en';
export type TranslationDictionary = typeof vi;
export type { Locale } from '@/stores/language.store';
export { useTranslation } from '@/hooks/useTranslation';
export {
  getLocalizedField,
  getLocalizedProductName,
  getLocalizedProductDescription,
  getLocalizedProductIngredients,
  getLocalizedBranchName,
  getLocalizedBranchAddress,
  getLocalizedBranchCity,
  getLocalizedCategoryName,
} from '@/utils/localize';
