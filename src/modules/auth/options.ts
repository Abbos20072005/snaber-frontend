import { queryOptions } from '@tanstack/react-query';

import { getAuthMe } from '@/shared/api';

export const AUTH_QUERY_KEYS = {
  me: () => ['me'] as const
} as const;

export const getAuthMeQueryOptions = () =>
  queryOptions({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: getAuthMe
  });
