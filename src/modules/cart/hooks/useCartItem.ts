import { useMutation } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEYS } from '@/modules/products';
import { postCart } from '@/shared/api/requests/product/cart';
import { useCartStore } from '@/shared/store/cartStore';

export interface StockCartItemParams {
  attributeStock: ProductVariantAttributeStock;
  type: 'ready';
}

export interface CustomCartItemParams {
  attributes: NonNullable<CartItemDto['attributes']>;
  deadline: string;
  type: 'rfq';
}

export type CartItemParams = CustomCartItemParams | StockCartItemParams;

export const useCartItem = (
  company: ProductCompany,
  product: ProductVariant,
  params: CartItemParams
) => {
  const {
    isAttributeStockInCart,
    getAttributeStockQuantity,
    setAttributeStockQuantity,
    isCustomAttributesInCart,
    getCustomAttributesQuantity,
    setCustomAttributesQuantity
  } = useCartStore();

  const postCartMutation = useMutation({
    mutationFn: postCart,
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getCartList()
    }
  });

  const isInCart =
    params.type === 'ready'
      ? isAttributeStockInCart(company.id, params.attributeStock.id)
      : isCustomAttributesInCart(company.id, product.id, params.attributes);

  const cartCount =
    params.type === 'ready'
      ? getAttributeStockQuantity(company.id, params.attributeStock.id)
      : getCustomAttributesQuantity(company.id, product.id, params.attributes);

  const setQuantity = (quantity: number) => {
    if (params.type === 'ready') {
      setAttributeStockQuantity(company.id, params.attributeStock.id, quantity);
    } else {
      setCustomAttributesQuantity(
        company.id,
        params.attributes,
        quantity,
        product.id,
        params.deadline
      );
    }
  };

  const buildDto = (quantity: number): CartItemDto => {
    if (params.type === 'ready') {
      return { product: product.id, quantity, attribute_stock: params.attributeStock.id };
    }
    return {
      product: product.id,
      quantity,
      attributes: params.attributes,
      deadline: params.deadline
    };
  };

  const mutateQuantity = (quantity: number) => {
    const previousQuantity = cartCount;
    setQuantity(quantity);
    postCartMutation.mutate(
      { data: buildDto(quantity) },
      { onError: () => setQuantity(previousQuantity) }
    );
  };

  const mutateDeadline = (deadline: string | null) => {
    if (params.type !== 'rfq') return;
    const previousDeadline = params.deadline;
    setCustomAttributesQuantity(company.id, params.attributes, cartCount, product.id, deadline);
    postCartMutation.mutate(
      { data: { ...buildDto(cartCount), deadline: deadline ?? undefined } },
      {
        onError: () =>
          setCustomAttributesQuantity(
            company.id,
            params.attributes,
            cartCount,
            product.id,
            previousDeadline
          )
      }
    );
  };

  return {
    state: {
      cartCount,
      isInCart,
      isCartAdding: postCartMutation.isPending
    },
    functions: {
      onAddToCart: () => mutateQuantity(1),
      onCartCountChange: (value: number) => mutateQuantity(value),
      onDeadlineChange: (deadline: string | null) => mutateDeadline(deadline),
      onRemoveFromCart: () => mutateQuantity(0)
    }
  };
};
