import { api } from '@/shared/api';

export const getCartList = () =>
  api.get<FullCardResponse>('/product/cart/').then(({ data }) => data);

interface PostCartRequest {
  data: CartItemDto;
}

export const postCart = ({ data }: PostCartRequest) => api.post<Cart>('/product/cart/', data);

export const postCartCheckout = (companyId: number) =>
  api.post('/product/cart/checkout/', { company: companyId });
