import { useSuspenseQuery } from '@tanstack/react-query';

import { getUnitOfMeasuresQueryOptions } from '@/modules/unit-of-measure';

import { UnitsOfMeasureCardsList } from './UnitsOfMeasureCardsList';
import { UnitsOfMeasureEmpty } from './UnitsOfMeasureEmpty';

export const UnitsOfMeasureCards = () => {
  const unitsQuery = useSuspenseQuery(getUnitOfMeasuresQueryOptions());

  const units = unitsQuery.data.data || [];
  const total = units.length ?? 0;

  if (!units.length) return <UnitsOfMeasureEmpty />;

  return <UnitsOfMeasureCardsList units={units} total={total} />;
};
