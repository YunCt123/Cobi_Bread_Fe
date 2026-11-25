import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
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
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      hasMixedStorage: () => {
        const items = get().items;
        const hasFresh = items.some((item) => item.product.storageType === 'FRESH');
        const hasFrozen = items.some((item) => item.product.storageType === 'FROZEN');
        return hasFresh && hasFrozen;
      },
    }),
    {
      name: 'cobi_cart_store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : dummyStorage
      ),
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
