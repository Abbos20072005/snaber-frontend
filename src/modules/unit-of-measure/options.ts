import type { GetUnitOfMeasuresRequest } from 'src/shared/api';

import { queryOptions } from '@tanstack/react-query';
import { getUnitOfMeasures } from 'src/shared/api';

export const UNIT_OF_MEASURES_QUERY_KEYS = {
  base: () => ['units-of-measures'] as const,
  getAll: (request?: GetUnitOfMeasuresRequest) =>
    [...UNIT_OF_MEASURES_QUERY_KEYS.base(), 'list', request] as const
} as const;

export const getUnitOfMeasuresQueryOptions = (request?: GetUnitOfMeasuresRequest) =>
  queryOptions({
    queryFn: () => getUnitOfMeasures(request),
    queryKey: UNIT_OF_MEASURES_QUERY_KEYS.getAll(request)
  });
