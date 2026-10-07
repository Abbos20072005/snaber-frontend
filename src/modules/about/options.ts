import { queryOptions } from '@tanstack/react-query';

import { getAboutInfo } from '@/shared/api/requests/about';

export const ABOUT_QUERY_KEYS = {
  base: () => ['about'] as const
} as const;

export const getAboutInfoOptions = () =>
  queryOptions({
    queryKey: ABOUT_QUERY_KEYS.base(),
    queryFn: () => getAboutInfo()
  });
