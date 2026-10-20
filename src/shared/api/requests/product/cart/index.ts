import { api } from '@/shared/api';

export const getCartList = () =>
  api.get<FullCardResponse>('/product/cart/').then(({ data }) => data);

interface PostCartRequest {
  data: CartItemDto;
}

export const postCart = ({ data }: PostCartRequest) => api.post<CartItem>('/product/cart/', data);

export const postCartCheckout = () => api.post<Order>('/product/cart/checkout/');
