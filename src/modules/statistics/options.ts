import { queryOptions } from '@tanstack/react-query';

import { getMainStatistics } from '@/shared/api/requests/statistics';

export const STATISTICS_QUERY_KEYS = {
  main: () => ['main'] as const
};

export const getMainStatisticsOptions = () =>
  queryOptions({
    queryKey: STATISTICS_QUERY_KEYS.main(),
    queryFn: () => getMainStatistics()
  });
