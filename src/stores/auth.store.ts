import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import type { User } from '@/types';

export const COOKIE_TOKEN_KEY = 'cobi_access_token';
export const COOKIE_ROLE_KEY = 'cobi_user_role';
export const COOKIE_USER_KEY = 'cobi_user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      setAuth: (user: User, accessToken: string) => {
        Cookies.set(COOKIE_TOKEN_KEY, accessToken, { expires: 7, path: '/' });
        Cookies.set(COOKIE_ROLE_KEY, user.role, { expires: 7, path: '/' });
        Cookies.set(COOKIE_USER_KEY, JSON.stringify(user), { expires: 7, path: '/' });

        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      updateUser: (updatedFields: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const newUser = { ...currentUser, ...updatedFields } as User;
        Cookies.set(COOKIE_USER_KEY, JSON.stringify(newUser), { expires: 7, path: '/' });
        if (newUser.role) {
          Cookies.set(COOKIE_ROLE_KEY, newUser.role, { expires: 7, path: '/' });
        }
        set({ user: newUser });
      },

      logout: () => {
        Cookies.remove(COOKIE_TOKEN_KEY, { path: '/' });
        Cookies.remove(COOKIE_ROLE_KEY, { path: '/' });
        Cookies.remove(COOKIE_USER_KEY, { path: '/' });

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'cobi_auth_store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);

          if (state.accessToken && state.user) {
            Cookies.set(COOKIE_TOKEN_KEY, state.accessToken, { expires: 7, path: '/' });
            Cookies.set(COOKIE_ROLE_KEY, state.user.role, { expires: 7, path: '/' });
            Cookies.set(COOKIE_USER_KEY, JSON.stringify(state.user), { expires: 7, path: '/' });
          }
        }
      },
    }
  )
);
