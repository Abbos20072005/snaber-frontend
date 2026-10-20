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

const getFavoriteId = (product: ProductPreview) => product.product_id ?? product.id;

const createFavoritesStore = (initialFavorites: ProductPreview[] = []) => {
  const initialMap: Record<number, ProductPreview> = {};
  initialFavorites.forEach((f) => (initialMap[getFavoriteId(f)] = f));

  return create<FavoritesStore>()((set, get) => ({
    favorites: initialFavorites,
    favoritesMap: initialMap,

    isFavorite: (productId) => Boolean(get().favoritesMap[productId]),

    toggleFavorite: (product) => {
      const productId = getFavoriteId(product);

      set((state) => {
        if (state.favoritesMap[productId]) {
          const { [productId]: _, ...rest } = state.favoritesMap;
          return {
            favoritesMap: rest,
            favorites: state.favorites.filter((f) => getFavoriteId(f) !== productId)
          };
        }
        return {
          favoritesMap: { ...state.favoritesMap, [productId]: product },
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
      favorites.forEach((f) => (map[getFavoriteId(f)] = f));
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
