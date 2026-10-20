import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { useQueryStates } from 'nuqs';

import { getPublicFilterQueryOptions } from '@/modules/attributes';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';

import { AttributeFilter } from './AttributeFilter';
import { FilterItemLabel } from './FilterItemLabel';
import { productFilterQueryConfig } from './product-filters.config';
import { RangeSlider } from './RangeSlider';

export interface MiniSiteFilterCategory {
  id: number;
  name: string;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  categories?: MiniSiteFilterCategory[];
  category?: number | string;
}

export const MiniSiteFilterSection = ({ className, category, categories, ...props }: Props) => {
  const { t } = useLingui();

  const [queryStates, setQueryStates] = useQueryStates(productFilterQueryConfig);

  const handleClear = () => {
    void setQueryStates({
      type: null,
      category: null,
      price_max: null,
      price_min: null,
      values: null
    });
  };

  const filtersAttributeID = queryStates.category || category;
  const selectedCategoryId = filtersAttributeID ? Number(filtersAttributeID) : null;
  const isCategoriesLoading = categories === undefined;
  const filtersQuery = useQuery({
    ...getPublicFilterQueryOptions({ params: { category: filtersAttributeID } }),
    enabled: !!filtersAttributeID
  });
  const filters = filtersQuery.data?.data;
  const shouldShowFilterSkeleton =
    isCategoriesLoading || (!!filtersAttributeID && filtersQuery.isPending);

  const handleCategoryChange = (categoryId: number) => {
    void setQueryStates({
      category: `${categoryId}`,
      price_max: null,
      price_min: null,
      values: null
    });
  };

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
      {isCategoriesLoading ? (
        <div className='space-y-2'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className='h-8 w-full' />
          ))}
        </div>
      ) : (
        categories.length > 0 && (
          <div className='space-y-3'>
            <FilterItemLabel label={t`Categories`} />
            <div className='space-y-1'>
              {categories.map((item) => (
                <Button
                  key={item.id}
                  className='flex w-full items-center justify-start gap-1 truncate'
                  variant={item.id === selectedCategoryId ? 'secondary' : 'ghost'}
                  onClick={() => handleCategoryChange(item.id)}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        )
      )}
      {filters ? (
        <>
          <RangeSlider max={filters.price_max} min={filters.price_min} />
          <AttributeFilter filters={filters} />
        </>
      ) : shouldShowFilterSkeleton ? (
        <>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className='h-5 w-full' />
          ))}
        </>
      ) : null}
    </div>
  );
};
