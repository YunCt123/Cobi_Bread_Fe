export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  BRANCHES: {
    BASE: '/branches',
    BY_ID: (id: string) => `/branches/${id}`,
    STATUS: (id: string) => `/branches/${id}/status`,
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/products',
    BY_SLUG: (slug: string) => `/products/${slug}`,
    BY_ID: (id: string) => `/products/${id}`,
  },
  INVENTORY: {
    AVAILABILITY: '/inventory/availability',
    BATCHES: '/inventory/batches',
  },
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    STATUS: (id: string) => `/users/${id}/status`,
  },
  ANALYTICS: {
    ADMIN_OVERVIEW: '/analytics/admin-overview',
    BRANCH_OVERVIEW: '/analytics/branch-overview',
  },
} as const;
