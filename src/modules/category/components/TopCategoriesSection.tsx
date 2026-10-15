import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import {
  CategorySidebar,
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
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const visibleSections = selectedId
    ? sections.filter((section) => section.id === selectedId)
    : sections;

  return (
    <div className='flex flex-col gap-6 md:flex-row'>
      <CategorySidebar roots={sections} selectedId={selectedId} onSelect={setSelectedId} />
      <div className='min-w-0 flex-1 space-y-8'>
        {visibleSections.map((section) => {
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
              <div className='mt-3 grid grid-cols-5 gap-x-1.5 gap-y-4 sm:grid-cols-7 lg:grid-cols-10'>
                {subcategories.map((sub) => (
                  <CategoryTile key={sub.id} category={sub} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
