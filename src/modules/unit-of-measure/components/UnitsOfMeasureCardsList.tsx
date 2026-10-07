import { useLingui } from '@lingui/react/macro';

import { UnitOfMeasureCard } from './UnitOfMeasureCard';

interface Props {
  total: number;
  units: UnitOfMeasure[];
}

export const UnitsOfMeasureCardsList = ({ total, units }: Props) => {
  const { t } = useLingui();

  return (
    <div className='space-y-4'>
      <div className='grid gap-3 sm:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8'>
        {units.map((unit) => (
          <UnitOfMeasureCard key={unit.id} unit={unit} />
        ))}
      </div>

      <div className='flex items-center justify-between gap-3'>
        <p className='text-muted-foreground text-sm'>
          {t`Showing`} {units.length} {t`of`} {total}
        </p>
      </div>
    </div>
  );
};
