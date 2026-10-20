import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';
import { useRef } from 'react';

import { getPublicFilterQueryOptions } from '@/modules/attributes';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

import { AttributeFilter } from './AttributeFilter';
import { FilterCategoryList } from './FilterCategoryList';
import { productFilterQueryConfig } from './product-filters.config';
import { RangeSlider } from './RangeSlider';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  category?: number | string;
}

export const FilterSection = ({ className, category, ...props }: Props) => {
  const { t } = useLingui();
  const defaultCategory = Number(category);
  const defaultCategoryId = Number.isFinite(defaultCategory) ? defaultCategory : undefined;

  const [queryStates, setQueryStates] = useQueryStates(productFilterQueryConfig);
  const resetExpandedRef = useRef<(() => void) | null>(null);

  const handleClear = () => {
    setQueryStates({
      type: null,
      category: null,
      price_max: null,
      price_min: null,
      values: null
    });
    resetExpandedRef.current?.();
  };

  const filtersAttributeID = queryStates.category || defaultCategoryId;
  const filtersQuery = useQuery(
    getPublicFilterQueryOptions({ params: { category: filtersAttributeID } })
  );
  const filters = filtersQuery.data?.data;

  return (
    <div
      {...props}
      className={cn(
        'ring-muted bg-background h-fit w-full space-y-3 rounded-2xl p-5 shadow-sm ring-1',
        className
      )}
    >
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium'>{t`Filters`}</span>
        <button
          className='text-muted-foreground hover:text-foreground text-sm underline transition-colors'
          onClick={handleClear}
        >
          {t`Clear all`}
        </button>
      </div>
      <FilterCategoryList resetRef={resetExpandedRef} category={category} />
      {filters ? (
        <>
          <RangeSlider max={filters.price_max} min={filters.price_min} />
          <AttributeFilter filters={filters} />
        </>
      ) : (
        <>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className='h-5 w-full' />
          ))}
        </>
      )}
    </div>
  );
};
