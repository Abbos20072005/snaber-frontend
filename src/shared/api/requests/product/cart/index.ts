import { api } from '@/shared/api';

export const getCartList = () =>
  api.get<FullCardResponse>('/product/cart/').then(({ data }) => data);

interface PostCartRequest {
  data: CartItemDto;
}

export const postCart = ({ data }: PostCartRequest) => api.post<CartItem>('/product/cart/', data);

interface PostCartCheckoutRequest {
  data: { custom_items: CartCustomItem[] };
}

export const postCartCheckout = ({ data }: PostCartCheckoutRequest) =>
  api.post<Order>('/product/cart/checkout/', data);
