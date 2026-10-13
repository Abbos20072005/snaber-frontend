import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { CategoryTile, getPublicAllCategoriesOptions } from '@/modules/category';
import { generateSlugId } from '@/shared/constants';

export const TopCategoriesSection = () => {
  const getPublicAllCategoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());

  const roots = getPublicAllCategoriesQuery.data ?? [];

  return (
    <div className='space-y-8'>
      {roots.map((root) => {
        const children = root.children ?? [];

        if (children.length === 0) return null;

        return (
          <section key={root.id}>
            <Link
              className='text-primary text-base font-semibold hover:underline'
              params={{ slug: generateSlugId(root.id, root.name) }}
              to='/catalog/$slug'
            >
              {root.name}
            </Link>
            <div className='mt-2 grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 lg:grid-cols-9'>
              {children.map((child) => (
                <CategoryTile key={child.id} category={child} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
