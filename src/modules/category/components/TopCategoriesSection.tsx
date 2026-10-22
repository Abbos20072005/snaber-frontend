import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import {
  CATEGORY_TILE_GRID,
  CategoryHeading,
  CategorySidebar,
  CategoryTile,
  getPublicAllCategoriesOptions
} from '@/modules/category';
import { generateSlugId } from '@/shared/constants';

export const TopCategoriesSection = () => {
  const { t } = useLingui();
  const getPublicAllCategoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const sections = useMemo(
    () => getPublicAllCategoriesQuery.data ?? [],
    [getPublicAllCategoriesQuery.data]
  );
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const visibleSections = selectedId
    ? sections.filter((section) => section.id === selectedId)
    : sections;

  return (
    <div className='flex flex-col gap-6 md:flex-row'>
      <CategorySidebar selectedId={selectedId} onSelect={setSelectedId} roots={sections} />
      <div className='min-w-0 flex-1 space-y-3'>
        <CategoryHeading title={t`All categories`} />

        {visibleSections.map((section) => {
          const subcategories = [...(section.children ?? [])].sort((a, b) =>
            a.code.localeCompare(b.code, undefined, { numeric: true })
          );

          if (subcategories.length === 0) return null;

          return (
            <section key={section.id}>
              <div className='border-b pb-2'>
                <h2 className='text-foreground text-sm font-bold md:text-base'>
                  <Link
                    className='hover:underline'
                    params={{ slug: generateSlugId(section.id, section.name) }}
                    to='/catalog/$slug'
                  >
                    {section.name}
                  </Link>
                </h2>
              </div>
              <div className={`mt-2 ${CATEGORY_TILE_GRID}`}>
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
