import { queryOptions } from '@tanstack/react-query';

import type {
  GetAttributesByCategoryRequest,
  GetAttributeValuesRequest,
  GetFilterRequest
} from '@/shared/api/';

import { getAllAttributesByCategory, getAttributeValues, getPublicFilter } from '@/shared/api/';

export const ATTRIBUTES_QUERY_KEYS = {
  all: () => ['attributes'] as const,
  lists: () => [...ATTRIBUTES_QUERY_KEYS.all(), 'list'] as const,
  getAllByCategory: (request?: GetAttributesByCategoryRequest) => [
    ...ATTRIBUTES_QUERY_KEYS.lists(),
    request
  ],
  values: () => [...ATTRIBUTES_QUERY_KEYS.all(), 'values'] as const,
  getPublicFilter: (request?: GetFilterRequest) =>
    [...ATTRIBUTES_QUERY_KEYS.all(), 'public', request] as const,
  getValues: (request?: GetAttributeValuesRequest) =>
    [...ATTRIBUTES_QUERY_KEYS.values(), request] as const
};

export const getAllAttributesByCategoryQueryOptions = (request?: GetAttributesByCategoryRequest) =>
  queryOptions({
    queryKey: ATTRIBUTES_QUERY_KEYS.getAllByCategory(request),
    queryFn: () => getAllAttributesByCategory(request)
  });

export const getAttributeValuesQueryOptions = (request?: GetAttributeValuesRequest) =>
  queryOptions({
    queryFn: () => getAttributeValues(request),
    queryKey: ATTRIBUTES_QUERY_KEYS.getValues(request)
  });

export const getPublicFilterQueryOptions = (request?: GetFilterRequest) =>
  queryOptions({
    queryKey: ATTRIBUTES_QUERY_KEYS.getPublicFilter(request),
    queryFn: () => getPublicFilter(request)
  });
