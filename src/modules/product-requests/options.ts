import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import type { GetProductRequestsRequest, GetWantedProductsRequest } from '@/shared/api';

import { getProductRequests, getWantedProducts } from '@/shared/api';

export const PRODUCT_REQUESTS_QUERY_KEYS = {
  base: () => ['product-requests'] as const,
  lists: () => [...PRODUCT_REQUESTS_QUERY_KEYS.base(), 'list'] as const,
  list: (request?: GetProductRequestsRequest) =>
    [...PRODUCT_REQUESTS_QUERY_KEYS.lists(), request] as const,
  wanted: (request?: GetWantedProductsRequest) =>
    [...PRODUCT_REQUESTS_QUERY_KEYS.base(), 'wanted', request] as const
} as const;

export const getProductRequestsQueryOptions = (request?: GetProductRequestsRequest) =>
  queryOptions({
    queryKey: PRODUCT_REQUESTS_QUERY_KEYS.list(request),
    queryFn: () => getProductRequests(request).then((res) => res.data),
    placeholderData: keepPreviousData
  });

export const getWantedProductsQueryOptions = (request?: GetWantedProductsRequest) =>
  queryOptions({
    queryKey: PRODUCT_REQUESTS_QUERY_KEYS.wanted(request),
    queryFn: () => getWantedProducts(request).then((res) => res.data),
    placeholderData: keepPreviousData
  });
