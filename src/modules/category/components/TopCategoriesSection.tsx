import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';

import {
  CategoryTile,
  getPublicAllCategoriesOptions
} from '@/modules/category';
import { generateSlugId } from '@/shared/constants';

export const TopCategoriesSection = () => {
  const getPublicAllCategoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const sections = useMemo(
    () => (getPublicAllCategoriesQuery.data ?? []).flatMap((group) => group.children ?? []),
    [getPublicAllCategoriesQuery.data]
  );

  return (
    <div className='space-y-10'>
      {sections.map((section) => {
        const subcategories = section.children ?? [];

        if (subcategories.length === 0) return null;

        return (
          <section key={section.id}>
            <div className='border-primary/60 border-t-2 pt-2'>
              <h2 className='text-primary text-xl font-bold md:text-2xl'>
                <Link
                  className='hover:underline'
                  params={{ slug: generateSlugId(section.id, section.name) }}
                  to='/catalog/$slug'
                >
                  {section.name}
                </Link>
              </h2>
            </div>
            <div className='mt-4 grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-6 lg:grid-cols-9'>
              {subcategories.map((sub) => (
                <CategoryTile key={sub.id} category={sub} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
