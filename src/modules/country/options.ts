import { queryOptions } from '@tanstack/react-query';

import { getCountries } from '@/shared/api';

export const COUNTRY_QUERY_KEYS = {
  base: () => ['countries'] as const,
  list: () => [...COUNTRY_QUERY_KEYS.base(), 'list'] as const
} as const;

export const getCountryQueryOptions = () =>
  queryOptions({
    queryKey: COUNTRY_QUERY_KEYS.list(),
    queryFn: getCountries
  });
