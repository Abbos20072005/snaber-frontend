import type { StoreApi, UseBoundStore } from 'zustand';

import { createContext, use, useRef } from 'react';
import { create } from 'zustand';

// productId -> quantity
type CartMap = Record<number, number>;

const computeCartItemsLength = (map: CartMap) =>
  Object.values(map).filter((quantity) => quantity > 0).length;

const buildCartMap = (items: CartItem[]): CartMap =>
  Object.fromEntries(items.map((item) => [item.product.id, item.quantity]));

interface CartStore {
  cartItemsLength: number;
  cartMap: CartMap;

  getProductQuantity: (productId: number) => number;
  isProductInCart: (productId: number) => boolean;
  setProductQuantity: (productId: number, quantity: number) => void;
  syncCart: (items: CartItem[]) => void;
}

const createCartStore = (initialItems: CartItem[] = []) => {
  const initialMap = buildCartMap(initialItems);

  return create<CartStore>()((set, get) => ({
    cartMap: initialMap,
    cartItemsLength: computeCartItemsLength(initialMap),

    isProductInCart: (productId) => (get().cartMap[productId] ?? 0) > 0,

    getProductQuantity: (productId) => get().cartMap[productId] ?? 0,

    setProductQuantity: (productId, quantity) => {
      const updatedMap = { ...get().cartMap, [productId]: quantity };
      set({ cartMap: updatedMap, cartItemsLength: computeCartItemsLength(updatedMap) });
    },

    syncCart: (items) => {
      const map = buildCartMap(items);
      set({ cartMap: map, cartItemsLength: computeCartItemsLength(map) });
    }
  }));
};

type CartStoreInstance = UseBoundStore<StoreApi<CartStore>>;

const CartContext = createContext<CartStoreInstance | null>(null);

export const CartProvider = ({
  children,
  initialCart
}: {
  children: React.ReactNode;
  initialCart: CartItem[];
}) => {
  const storeRef = useRef<CartStoreInstance | null>(null);

  if (!storeRef.current) {
    storeRef.current = createCartStore(initialCart);
  }

  return <CartContext.Provider value={storeRef.current}>{children}</CartContext.Provider>;
};

export function useCartStore(): CartStore;
export function useCartStore<T>(selector: (state: CartStore) => T): T;
export function useCartStore<T = CartStore>(selector?: (state: CartStore) => T) {
  const store = use(CartContext);
  if (!store) throw new Error('useCartStore must be used within CartProvider');
  return store(selector ?? ((s) => s as unknown as T));
}
