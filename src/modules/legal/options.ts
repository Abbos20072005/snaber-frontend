import { queryOptions } from '@tanstack/react-query';

import { getLegalInfo } from '@/shared/api/requests/legal';

export const LEGAL_QUERY_KEYS = {
  base: () => ['legal'] as const
} as const;

export const getLegalInfoOptions = () =>
  queryOptions({
    queryKey: LEGAL_QUERY_KEYS.base(),
    queryFn: () => getLegalInfo()
  });
