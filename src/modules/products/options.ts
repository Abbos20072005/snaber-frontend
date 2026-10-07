import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

import type {
  GetAttributesByCategoryRequest,
  GetAttributeValuesRequest,
  GetProductByIdRequest,
  GetProductDraftByIdRequest,
  GetProductDraftRequest,
  GetProductsRequest,
  GetProductVariantsRequest,
  GetPublicProductByIdRequest,
  GetPublicProductsRequest
} from '@/shared/api';

import {
  getAllAttributesByCategory,
  getAttributeValues,
  getFavouriteProducts,
  getProductById,
  getProductDraftById,
  getProductDrafts,
  getProducts,
  getProductVariant,
  getPublicProductById,
  getPublicProducts
} from '@/shared/api';
import { getCartList } from '@/shared/api/requests/product/cart';

export const PRODUCT_QUERY_KEYS = {
  base: () => ['products'] as const,
  getAll: (request?: GetProductsRequest) => [...PRODUCT_QUERY_KEYS.base(), request] as const,
  getById: (request: GetProductByIdRequest) =>
    [...PRODUCT_QUERY_KEYS.base(), 'detail', request] as const,
  getPublicProducts: (request?: GetPublicProductsRequest) =>
    [...PRODUCT_QUERY_KEYS.base(), 'public', request] as const,
  getPublicProductById: (request: GetPublicProductByIdRequest) =>
    [...PRODUCT_QUERY_KEYS.base(), 'detail', request] as const,
  getFavorites: () => [...PRODUCT_QUERY_KEYS.base(), 'favorites'] as const,
  getDraftProducts: (request?: GetProductDraftRequest) =>
    [...PRODUCT_QUERY_KEYS.base(), 'draft', request] as const,
  getDraftProductById: (request: GetProductDraftByIdRequest) =>
    [...PRODUCT_QUERY_KEYS.base(), 'draft', 'detail', request] as const,
  getCartList: () => [...PRODUCT_QUERY_KEYS.base(), 'cartList'] as const
} as const;

export const getDraftProductsQueryOptions = (request?: GetProductDraftRequest) =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getDraftProducts(request),
    queryFn: () => getProductDrafts(request)
  });

export const getDraftProductByIdQueryOptions = (request: GetProductDraftByIdRequest) =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getDraftProductById(request),
    queryFn: () => getProductDraftById(request)
  });

export const getPublicProductsQueryOptions = (request: GetPublicProductsRequest) =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getPublicProducts(request),
    queryFn: () => getPublicProducts(request)
  });

export const getPublicProductsInfiniteOptions = (request?: GetPublicProductsRequest) =>
  infiniteQueryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getPublicProducts(request),

    queryFn: ({ pageParam = 1 }) =>
      getPublicProducts({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined),

    placeholderData: keepPreviousData
  });

export const getPublicProductByIdQueryOptions = (request: GetPublicProductByIdRequest) =>
  queryOptions({
    queryFn: () => getPublicProductById(request).then((data) => data.data),
    queryKey: PRODUCT_QUERY_KEYS.getPublicProductById(request)
  });

export const getProductsQueryOptions = (request?: GetProductsRequest) =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getAll(request),
    queryFn: () => getProducts(request)
  });

export const getProductByIdQueryOptions = (request: GetProductByIdRequest) =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getById(request),
    queryFn: () => getProductById(request)
  });

export const PRODUCT_VARIANT_QUERY_KEYS = {
  all: () => ['product-variants'] as const,
  getById: (request: GetProductVariantsRequest) =>
    [...PRODUCT_VARIANT_QUERY_KEYS.all(), request] as const
};

export const getProductVariantQueryOptions = (request: GetProductVariantsRequest) =>
  queryOptions({
    queryFn: () => getProductVariant(request),
    queryKey: PRODUCT_VARIANT_QUERY_KEYS.getById(request)
  });

export const PRODUCT_ATTRIBUTE_QUERY_KEYS = {
  all: () => ['product-attributes'] as const,
  values: () => [...PRODUCT_ATTRIBUTE_QUERY_KEYS.all(), 'values'] as const,
  getByCategory: (request?: GetAttributesByCategoryRequest) =>
    [...PRODUCT_ATTRIBUTE_QUERY_KEYS.all(), request] as const,
  getValues: (request?: GetAttributeValuesRequest) =>
    [...PRODUCT_ATTRIBUTE_QUERY_KEYS.values(), request] as const
};

export const getProductAttributesByCategoryQueryOptions = (
  request?: GetAttributesByCategoryRequest
) =>
  queryOptions({
    queryFn: () => getAllAttributesByCategory(request),
    queryKey: PRODUCT_ATTRIBUTE_QUERY_KEYS.getByCategory(request)
  });

export const getProductAttributeValuesQueryOptions = (request?: GetAttributeValuesRequest) =>
  queryOptions({
    queryFn: () => getAttributeValues(request),
    queryKey: PRODUCT_ATTRIBUTE_QUERY_KEYS.getValues(request)
  });

export const getFavoritesQueryOptions = () =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getFavorites(),
    queryFn: () => getFavouriteProducts()
  });

export const getCartListQueryOptions = () =>
  queryOptions({
    queryKey: PRODUCT_QUERY_KEYS.getCartList(),
    staleTime: 0,
    queryFn: () => getCartList()
  });
