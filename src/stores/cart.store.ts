import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, StorageType } from '@/types';
import { BRAND_ASSETS } from '@/data/cobi-content';

export interface CartItem {
  productId: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  price: number;
  image: string;
  storageType: StorageType;
  netWeightG?: number;
  quantity: number;
  product?: Product;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setHydrated: (hydrated: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  hasMixedStorage: () => boolean;
}

const dummyStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    name: product.name,
    nameEn: product.nameEn ?? null,
    slug: product.slug,
    price: product.price,
    image: product.images?.[0] || BRAND_ASSETS.heroImage,
    storageType: product.storageType,
    netWeightG: product.netWeightG,
    quantity,
    product,
  };
}

function normalizeStoredItem(raw: any): CartItem | null {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.product && raw.product.id) {
    return {
      productId: raw.productId || raw.product.id,
      name: raw.name || raw.product.name,
      nameEn: raw.nameEn ?? raw.product.nameEn ?? null,
      slug: raw.slug || raw.product.slug,
      price: Number(raw.price ?? raw.product.price ?? 0),
      image: raw.image || raw.product.images?.[0] || BRAND_ASSETS.heroImage,
      storageType: raw.storageType || raw.product.storageType || 'FRESH',
      netWeightG: raw.netWeightG ?? raw.product.netWeightG,
      quantity: Math.max(1, Number(raw.quantity || 1)),
      product: raw.product,
    };
  }
  if (raw.productId) {
    return {
      productId: String(raw.productId),
      name: String(raw.name || 'Cobi Bread'),
      nameEn: raw.nameEn ?? null,
      slug: String(raw.slug || ''),
      price: Number(raw.price || 0),
      image: String(raw.image || BRAND_ASSETS.heroImage),
      storageType: raw.storageType || 'FRESH',
      netWeightG: raw.netWeightG,
      quantity: Math.max(1, Number(raw.quantity || 1)),
    };
  }
  return null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => (item.productId || item.product?.id) === product.id
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            const prev = newItems[existingIndex];
            newItems[existingIndex] = {
              ...toCartItem(product, prev.quantity + quantity),
            };
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, toCartItem(product, quantity)],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => (item.productId || item.product?.id) !== productId
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            (item.productId || item.product?.id) === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      hasMixedStorage: () => {
        const items = get().items;
        const hasFresh = items.some((item) => item.storageType === 'FRESH');
        const hasFrozen = items.some((item) => item.storageType === 'FROZEN');
        return hasFresh && hasFrozen;
      },
    }),
    {
      name: 'cobi_cart_store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        items: state.items.map(({ product: _ignored, ...rest }) => rest),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (Array.isArray(state.items)) {
            state.items = state.items
              .map(normalizeStoredItem)
              .filter((x): x is CartItem => x !== null);
          }
          state.setHydrated(true);
        }
      },
    }
  )
);
