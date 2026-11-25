import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Branch } from '@/types';

interface BranchState {
  selectedBranch: Branch | null;
  branches: Branch[];
  isHydrated: boolean;
  setSelectedBranch: (branch: Branch) => void;
  setBranches: (branches: Branch[]) => void;
  setHydrated: (hydrated: boolean) => void;
}

const dummyStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranch: null,
      branches: [],
      isHydrated: false,

      setSelectedBranch: (branch: Branch) => {
        set({ selectedBranch: branch });
      },

      setBranches: (branches: Branch[]) => {
        set({ branches });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'cobi_branch_store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)),
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
