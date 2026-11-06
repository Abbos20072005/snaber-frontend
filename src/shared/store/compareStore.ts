import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_COMPARE_PER_CATEGORY = 4;

interface CompareItem {
  category: number;
  id: number;
}

interface CompareStore {
  isHydrated: boolean;
  items: CompareItem[];
  clear: (category: number) => void;
  remove: (productId: number) => void;
  // Returns false when the category already has the maximum number of products.
  toggle: (item: CompareItem) => boolean;
}

// The list lives in the browser only, so it is restored after the first render (see StoreSync).
export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      remove: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),

      clear: (category) =>
        set((state) => ({ items: state.items.filter((item) => item.category !== category) })),

      toggle: (item) => {
        const { items, remove } = get();

        if (items.some((current) => current.id === item.id)) {
          remove(item.id);
          return true;
        }
        if (
          items.filter((current) => current.category === item.category).length >=
          MAX_COMPARE_PER_CATEGORY
        )
          return false;

        set({ items: [...items, item] });
        return true;
      }
    }),
    {
      name: 'compare',
      partialize: ({ items }) => ({ items }),
      skipHydration: true,
      onRehydrateStorage: () => () => useCompareStore.setState({ isHydrated: true })
    }
  )
);
