import type { StoreApi, UseBoundStore } from 'zustand';

import { createContext, use, useRef } from 'react';
import { create } from 'zustand';

interface StockCartEntry {
  attributeStockId: number;
  quantity: number;
  type: 'ready';
}

interface CustomCartEntry {
  attributes: NonNullable<CartItemDto['attributes']>;
  deadline: string | null;
  quantity: number;
  type: 'rfq';
  variant: number;
}

type CartEntry = CustomCartEntry | StockCartEntry;

// companyId -> itemKey -> entry
type CartMap = Record<number, Record<string, CartEntry>>;

const stockKey = (attributeStockId: number) => `ready:${attributeStockId}`;

const customKey = (variantId: number, attributes: NonNullable<CartItemDto['attributes']>) => {
  const sorted = [...attributes].sort((a, b) => a.attribute - b.attribute);
  return `rfq:${variantId}-${sorted.map((a) => `${a.attribute}:${a.value_option ?? a.value}`).join('|')}`;
};

const computeCartItemsLength = (map: CartMap) =>
  Object.values(map).reduce(
    (total, companyItems) =>
      total + Object.values(companyItems).filter((entry) => entry.quantity > 0).length,
    0
  );

const buildCartMap = (carts: Cart[]): CartMap => {
  const map: CartMap = {};
  for (const cart of carts) {
    const companyId = cart.company.id;
    map[companyId] = {};
    for (const item of cart.items) {
      if (item.attribute_stock) {
        const key = stockKey(item.attribute_stock.id);
        map[companyId][key] = {
          type: 'ready',
          quantity: item.quantity,
          attributeStockId: item.attribute_stock.id
        };
      } else if (item.attributes) {
        const dto = item.attributes.map((a) => ({
          attribute: a.attribute,
          value: a.value,
          value_option: a.value_option?.id
        }));
        const key = customKey(item.variant.id, dto);
        map[companyId][key] = {
          type: 'rfq',
          quantity: item.quantity,
          attributes: dto,
          variant: item.variant.id,
          deadline: item.deadline
        };
      }
    }
  }
  return map;
};

const applyEntry = (map: CartMap, companyId: number, key: string, entry: CartEntry): CartMap => ({
  ...map,
  [companyId]: { ...map[companyId], [key]: entry }
});

interface CartStore {
  cartItemsLength: number;
  cartMap: CartMap;

  getAttributeStockQuantity: (companyId: number, attributeStockId: number) => number;
  getCustomAttributesQuantity: (
    companyId: number,
    variantId: number,
    attributes: NonNullable<CartItemDto['attributes']>
  ) => number;
  getRfqCartItem: (
    companyId: number,
    variantId: number,
    attributes: NonNullable<CartItemDto['attributes']>
  ) => CustomCartEntry | undefined;
  isAttributeStockInCart: (companyId: number, attributeStockId: number) => boolean;
  isCustomAttributesInCart: (
    companyId: number,
    variantId: number,
    attributes: NonNullable<CartItemDto['attributes']>
  ) => boolean;
  setAttributeStockQuantity: (
    companyId: number,
    attributeStockId: number,
    quantity: number
  ) => void;
  setCustomAttributesQuantity: (
    companyId: number,
    attributes: NonNullable<CartItemDto['attributes']>,
    quantity: number,
    variantId: number,
    deadline?: string | null
  ) => void;
  syncCart: (carts: Cart[]) => void;
  syncCompanyCart: (cart: Cart) => void;
}

const createCartStore = (initialCarts: Cart[] = []) => {
  const initialMap = buildCartMap(initialCarts);

  return create<CartStore>()((set, get) => ({
    cartMap: initialMap,
    cartItemsLength: computeCartItemsLength(initialMap),

    isAttributeStockInCart: (companyId, attributeStockId) =>
      (get().cartMap[companyId]?.[stockKey(attributeStockId)]?.quantity ?? 0) > 0,

    getAttributeStockQuantity: (companyId, attributeStockId) =>
      get().cartMap[companyId]?.[stockKey(attributeStockId)]?.quantity ?? 0,

    setAttributeStockQuantity: (companyId, attributeStockId, quantity) => {
      const updatedMap = applyEntry(get().cartMap, companyId, stockKey(attributeStockId), {
        type: 'ready',
        quantity,
        attributeStockId
      });
      set({ cartMap: updatedMap, cartItemsLength: computeCartItemsLength(updatedMap) });
    },

    isCustomAttributesInCart: (companyId, variant, attributes) =>
      (get().cartMap[companyId]?.[customKey(variant, attributes)]?.quantity ?? 0) > 0,

    getCustomAttributesQuantity: (companyId, variant, attributes) =>
      get().cartMap[companyId]?.[customKey(variant, attributes)]?.quantity ?? 0,

    getRfqCartItem: (companyId, variant, attributes) => {
      const entry = get().cartMap[companyId]?.[customKey(variant, attributes)];
      return entry?.type === 'rfq' ? entry : undefined;
    },

    setCustomAttributesQuantity: (companyId, attributes, quantity, variant, deadline) => {
      const updatedMap = applyEntry(get().cartMap, companyId, customKey(variant, attributes), {
        type: 'rfq',
        quantity,
        attributes,
        variant,
        deadline: deadline ?? null
      });
      set({ cartMap: updatedMap, cartItemsLength: computeCartItemsLength(updatedMap) });
    },

    syncCart: (carts) => {
      const map = buildCartMap(carts);
      set({ cartMap: map, cartItemsLength: computeCartItemsLength(map) });
    },

    syncCompanyCart: (cart) => {
      const companyId = cart.company.id;
      const companyMap: Record<string, CartEntry> = {};
      for (const item of cart.items) {
        if (item.attribute_stock) {
          const key = stockKey(item.attribute_stock.id);
          companyMap[key] = {
            type: 'ready',
            quantity: item.quantity,
            attributeStockId: item.attribute_stock.id
          };
        } else if (item.attributes) {
          const dto = item.attributes.map((a) => ({
            attribute: a.attribute,
            value: a.value,
            value_option: a.value_option?.id
          }));
          const key = customKey(item.variant.id, dto);
          companyMap[key] = {
            type: 'rfq',
            quantity: item.quantity,
            attributes: dto,
            variant: item.variant.id,
            deadline: item.deadline
          };
        }
      }
      const updatedMap = { ...get().cartMap, [companyId]: companyMap };
      set({ cartMap: updatedMap, cartItemsLength: computeCartItemsLength(updatedMap) });
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
  initialCart: Cart[];
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
