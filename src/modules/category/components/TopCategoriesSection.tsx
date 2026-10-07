import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { CategoryCard, getPublicAllCategoriesOptions } from '@/modules/category';
import { generateSlugId } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

const MAX_VISIBLE_CATEGORIES = 18;

const getVisibilityClassName = (index: number) => {
  if (index >= 12) return 'hidden lg:block';
  if (index >= 9) return 'hidden sm:block';
  return undefined;
};

export const TopCategoriesSection = () => {
  const getPublicAllCategoriesQuery = useSuspenseQuery(
    getPublicAllCategoriesOptions({ params: { is_popular: true } })
  );

  const topCategories = getPublicAllCategoriesQuery.data.slice(0, MAX_VISIBLE_CATEGORIES);

  return (
    <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:gap-3 lg:grid-cols-6'>
      {topCategories.map((item, index) => (
        <Link
          key={item.id}
          className={cn(getVisibilityClassName(index))}
          params={{ slug: generateSlugId(item.id, item.name) }}
          to='/catalog/$slug'
        >
          <CategoryCard category={item} compact />
        </Link>
      ))}
    </div>
  );
};
