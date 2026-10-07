import { queryOptions } from '@tanstack/react-query';

import { getCurrencies } from '@/shared/api';

export const CURRENCY_QUERY_KEYS = {
  base: () => ['currencies'] as const,
  list: () => [...CURRENCY_QUERY_KEYS.base(), 'list'] as const
} as const;

export const getCurrencyQueryOptions = () =>
  queryOptions({
    queryKey: CURRENCY_QUERY_KEYS.list(),
    queryFn: getCurrencies
  });
