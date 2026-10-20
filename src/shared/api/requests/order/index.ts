import { api } from '@/shared/api';

export interface GetOrdersRequest {
  params?: Partial<{
    page: number;
    page_size: number;
    category: number;
  }>;
}

export const getOrders = (request?: GetOrdersRequest) =>
  api.get<OrdersResponse>('order/', {
    params: request?.params
  });

export interface GetOrderRequest {
  id: number;
}

export const getOrder = ({ id }: GetOrderRequest) => api.get<Order>(`order/${id}/`);
