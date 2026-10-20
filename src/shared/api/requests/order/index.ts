import { api } from '@/shared/api';

export interface GetOrdersRequest {
  params?: Partial<{
    page: number;
    page_size: number;
    category: number;
    status: OrderStatus;
    order_type: OrderType;
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

interface PostOrderRequest {
  data: {
    company: number;
  };
}

export const postOrder = ({ data }: PostOrderRequest) =>
  api.post<Order>('order/', data).then(({ data }) => data);

interface PatchOrderRequest {
  id: number;
  data: Partial<{
    status: OrderStatus;
    is_closed: boolean;
  }>;
}

export const patchOrder = ({ id, data }: PatchOrderRequest) =>
  api.patch<Order>(`order/${id}/`, data);
