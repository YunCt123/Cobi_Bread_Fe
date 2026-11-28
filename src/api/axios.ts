import axios from 'axios';
import { toast } from 'sonner';
import { ENV } from '@/config/env';
import { useAuthStore } from '@/stores/auth.store';
import { useLanguageStore } from '@/stores/language.store';

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let lastUnauthorizedToastAt = 0;
let lastServerErrorToastAt = 0;

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const status = error?.response?.status as number | undefined;
      const reqUrl = String(error?.config?.url || '');
      const currentPath = window.location.pathname;
      const locale = useLanguageStore.getState().locale;

      const isAuthEndpoint =
        reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');

      const isProtectedPath =
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/manager') ||
        currentPath.startsWith('/account');

      if (status === 401 && !isAuthEndpoint) {
        const hadToken = Boolean(useAuthStore.getState().accessToken);
        if (hadToken && (reqUrl.includes('/auth/me') || isProtectedPath)) {
          useAuthStore.getState().logout();
          const now = Date.now();
          if (now - lastUnauthorizedToastAt > 4000) {
            lastUnauthorizedToastAt = now;
            toast.error(
              locale === 'en'
                ? 'Your session has expired. Please sign in again.'
                : 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.'
            );
          }
          // RoleGuard & protected views observe useAuthStore and redirect via useRouter()
        }
      } else if (status && status >= 500 && !reqUrl.includes('/analytics/')) {
        const now = Date.now();
        if (now - lastServerErrorToastAt > 5000) {
          lastServerErrorToastAt = now;
          toast.error(
            locale === 'en'
              ? 'Server error occurred. Please try again shortly.'
              : 'Máy chủ đang bận hoặc gặp sự cố, vui lòng thử lại sau.'
          );
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
