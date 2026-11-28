import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Locale = 'vi' | 'en';

interface LanguageState {
  locale: Locale;
  isHydrated: boolean;
  setLocale: (locale: Locale) => void;
  setHydrated: (hydrated: boolean) => void;
}

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: 'vi',
      isHydrated: false,

      setLocale: (locale: Locale) => {
        set({ locale: locale === 'en' ? 'en' : 'vi' });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'cobi_language_store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        locale: state.locale,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
