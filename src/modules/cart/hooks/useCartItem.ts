import { useMutation } from '@tanstack/react-query';

import { PRODUCT_QUERY_KEYS } from '@/modules/products';
import { postCart } from '@/shared/api/requests/product/cart';
import { useCartStore } from '@/shared/store/cartStore';

export const useCartItem = (product: Pick<ProductBase, 'id'>) => {
  const { isProductInCart, getProductQuantity, setProductQuantity } = useCartStore();

  const postCartMutation = useMutation({
    mutationFn: postCart,
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getCartList()
    }
  });

  const isInCart = isProductInCart(product.id);
  const cartCount = getProductQuantity(product.id);

  const mutateQuantity = (quantity: number) => {
    const previousQuantity = cartCount;
    setProductQuantity(product.id, quantity);
    postCartMutation.mutate(
      { data: { product: product.id, quantity } },
      {
        onError: () => setProductQuantity(product.id, previousQuantity)
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
      onRemoveFromCart: () => mutateQuantity(0)
    }
  };
};
