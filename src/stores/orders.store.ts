import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StorageType } from '@/types';

export interface LocalOrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  storageType: StorageType;
  image?: string;
}

export interface LocalOrder {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  address?: string;
  note?: string;
  deliveryMethod: 'DELIVERY' | 'PICKUP';
  paymentMethod: string;
  branchName?: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED';
  items: LocalOrderItem[];
}

interface OrdersState {
  orders: LocalOrder[];
  addOrder: (order: LocalOrder) => void;
  clearOrders: () => void;
}

const dummyStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: 'cobi_local_orders',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : dummyStorage
      ),
    }
  )
);
