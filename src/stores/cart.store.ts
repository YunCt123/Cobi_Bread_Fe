import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, StorageType } from '@/types';
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
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function sanitizePositiveInt(val: unknown, fallback = 1): number {
  const num = Math.floor(Number(val));
  return Number.isFinite(num) && num >= 1 ? num : fallback;
}

function sanitizeNonNegativePrice(val: unknown): number {
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    name: product.name,
    nameEn: product.nameEn ?? null,
    slug: product.slug,
    price: sanitizeNonNegativePrice(product.price),
    image: product.images?.[0] || BRAND_ASSETS.heroImage,
    storageType: product.storageType,
    netWeightG: product.netWeightG,
    quantity: sanitizePositiveInt(quantity, 1),
    product,
  };
}

function normalizeStoredItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const nestedProd =
    obj.product && typeof obj.product === 'object'
      ? (obj.product as Partial<Product>)
      : undefined;

  const productId = String(obj.productId || nestedProd?.id || '').trim();
  if (!productId) return null;

  const storageRaw = obj.storageType || nestedProd?.storageType;
  const storageType: StorageType =
    storageRaw === 'FROZEN' || storageRaw === 'AMBIENT' ? storageRaw : 'FRESH';

  return {
    productId,
    name: String(obj.name || nestedProd?.name || 'Cobi Bread'),
    nameEn:
      typeof obj.nameEn === 'string'
        ? obj.nameEn
        : typeof nestedProd?.nameEn === 'string'
        ? nestedProd.nameEn
        : null,
    slug: String(obj.slug || nestedProd?.slug || ''),
    price: sanitizeNonNegativePrice(obj.price ?? nestedProd?.price ?? 0),
    image: String(obj.image || nestedProd?.images?.[0] || BRAND_ASSETS.heroImage),
    storageType,
    netWeightG:
      typeof obj.netWeightG === 'number'
        ? obj.netWeightG
        : typeof nestedProd?.netWeightG === 'number'
        ? nestedProd.netWeightG
        : undefined,
    quantity: sanitizePositiveInt(obj.quantity, 1),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      addItem: (product: Product, quantity = 1) => {
        if (!product || !product.id) return;
        const safeQty = Math.floor(Number(quantity));
        if (!Number.isFinite(safeQty) || safeQty <= 0) return;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => (item.productId || item.product?.id) === product.id
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            const prev = newItems[existingIndex];
            newItems[existingIndex] = {
              ...toCartItem(product, prev.quantity + safeQty),
            };
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, toCartItem(product, safeQty)],
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
        const safeQty = Math.floor(Number(quantity));
        if (!Number.isFinite(safeQty) || safeQty <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            (item.productId || item.product?.id) === productId
              ? { ...item, quantity: safeQty }
              : item
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
        return get().items.reduce((sum, item) => sum + sanitizePositiveInt(item.quantity, 0), 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) =>
            sum + sanitizeNonNegativePrice(item.price) * sanitizePositiveInt(item.quantity, 0),
          0
        );
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
        items: state.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          nameEn: item.nameEn,
          slug: item.slug,
          price: item.price,
          image: item.image,
          storageType: item.storageType,
          netWeightG: item.netWeightG,
          quantity: item.quantity,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (Array.isArray(state.items)) {
            state.items = state.items
              .map(normalizeStoredItem)
              .filter((x): x is CartItem => x !== null);
          } else {
            state.items = [];
          }
          state.setHydrated(true);
        }
      },
    }
  )
);
