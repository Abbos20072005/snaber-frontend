import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { GetOrderRequest, GetOrdersRequest } from '@/shared/api';

import { getOrder, getOrders } from '@/shared/api';

export const ORDER_QUERY_KEYS = {
  base: () => ['orders'] as const,
  getAll: (request?: GetOrdersRequest) => [...ORDER_QUERY_KEYS.base(), request] as const,
  getById: (request: GetOrderRequest) => [...ORDER_QUERY_KEYS.base(), 'detail', request] as const
};

export const getOrdersInfiniteQueryOptions = (request?: GetOrdersRequest) =>
  infiniteQueryOptions({
    queryFn: ({ pageParam = 1 }) =>
      getOrders({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    queryKey: ORDER_QUERY_KEYS.getAll(request),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.next ? allPages.length + 1 : undefined,
    initialPageParam: 1
  });

export const getOrderByIdQueryOptions = (request: GetOrderRequest) =>
  queryOptions({
    queryFn: () => getOrder(request),
    queryKey: ORDER_QUERY_KEYS.getById(request)
  });
