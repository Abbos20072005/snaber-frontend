import type { StoreApi, UseBoundStore } from 'zustand';

import { createContext, use, useRef } from 'react';
import { create } from 'zustand';

interface FavoritesStore {
  favorites: ProductPreview[];
  favoritesMap: Record<number, ProductPreview>;
  isFavorite: (productId: number) => boolean;
  setFavorites: (favorites: ProductPreview[] | null) => void;
  toggleFavorite: (product: ProductPreview) => void;
}

const createFavoritesStore = (initialFavorites: ProductPreview[] = []) => {
  const initialMap: Record<number, ProductPreview> = {};
  initialFavorites.forEach((f) => (initialMap[f.id] = f));

  return create<FavoritesStore>()((set, get) => ({
    favorites: initialFavorites,
    favoritesMap: initialMap,

    isFavorite: (productId) => productId in get().favoritesMap,

    toggleFavorite: (product) => {
      set((state) => {
        if (state.favoritesMap[product.id]) {
          const { [product.id]: _, ...rest } = state.favoritesMap;
          return {
            favoritesMap: rest,
            favorites: state.favorites.filter((f) => f.id !== product.id)
          };
        }
        return {
          favoritesMap: { ...state.favoritesMap, [product.id]: product },
          favorites: [...state.favorites, product]
        };
      });
    },

    setFavorites: (favorites) => {
      if (!favorites?.length) {
        set({ favoritesMap: {}, favorites: [] });
        return;
      }
      const map: Record<number, ProductPreview> = {};
      favorites.forEach((f) => (map[f.id] = f));
      set({ favoritesMap: map, favorites });
    }
  }));
};

type FavoritesStoreInstance = UseBoundStore<StoreApi<FavoritesStore>>;

const FavoritesContext = createContext<FavoritesStoreInstance | null>(null);

export const FavoritesProvider = ({
  children,
  initialFavorites
}: {
  children: React.ReactNode;
  initialFavorites: ProductPreview[];
}) => {
  const storeRef = useRef<FavoritesStoreInstance | null>(null);

  // Creates the store once with data already inside — no useEffect needed
  if (!storeRef.current) {
    storeRef.current = createFavoritesStore(initialFavorites);
  }

  return <FavoritesContext.Provider value={storeRef.current}>{children}</FavoritesContext.Provider>;
};

export function useFavoritesStore(): FavoritesStore;
export function useFavoritesStore<T>(selector: (state: FavoritesStore) => T): T;

export function useFavoritesStore<T = FavoritesStore>(selector?: (state: FavoritesStore) => T) {
  const store = use(FavoritesContext);
  if (!store) throw new Error('useFavoritesStore must be used within FavoritesProvider');
  return store(selector ?? ((s) => s as unknown as T));
}
