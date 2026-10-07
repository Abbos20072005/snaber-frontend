import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import type { GlobalSearchRequest } from '@/shared/api/requests/global-search';

import { getGlobalSearch } from '@/shared/api/requests/global-search';

export const GLOBAL_SEARCH_QUERY_KEYS = {
  base: () => ['global-search'] as const,
  all: (request: GlobalSearchRequest) => [...GLOBAL_SEARCH_QUERY_KEYS.base(), request] as const
} as const;

export const getGlobalSearchQueryOptions = (request: GlobalSearchRequest, enabled?: boolean) =>
  queryOptions({
    queryFn: () => getGlobalSearch(request),
    queryKey: GLOBAL_SEARCH_QUERY_KEYS.all(request),
    enabled,
    placeholderData: keepPreviousData
  });
