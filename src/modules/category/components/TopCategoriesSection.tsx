import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import {
  CategoryHeading,
  CategorySidebar,
  CategoryTile,
  getPublicAllCategoriesOptions
} from '@/modules/category';
import { generateSlugId } from '@/shared/constants';

export type TopCategoriesDesign = 'a' | 'b';

const DESIGN_GRID: Record<TopCategoriesDesign, string> = {
  a: 'grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5',
  b: 'grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5'
};

// TEMPORARY: static design B preview row shown above the list so it can be compared with design A.
const PREVIEW_CODES = ['sec-01-1', 'sec-01-2', 'sec-01-3', 'sec-01-4', 'sec-01-5', 'sec-01-6'];

export const TopCategoriesSection = ({ design = 'a' }: { design?: TopCategoriesDesign }) => {
  const { t } = useLingui();
  const getPublicAllCategoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const sections = useMemo(
    () => getPublicAllCategoriesQuery.data ?? [],
    [getPublicAllCategoriesQuery.data]
  );
  const previewCategories = useMemo(
    () =>
      sections
        .flatMap((section) => section.children ?? [])
        .filter((category) => PREVIEW_CODES.includes(category.code))
        .sort((a, b) => PREVIEW_CODES.indexOf(a.code) - PREVIEW_CODES.indexOf(b.code)),
    [sections]
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

        {previewCategories.length > 0 && (
          <section>
            <div className='border-b pb-2'>
              <h2 className='text-foreground text-sm font-bold md:text-base'>Design B (preview)</h2>
            </div>
            <div className={`mt-2 grid ${DESIGN_GRID.b}`}>
              {previewCategories.map((category) => (
                <CategoryTile key={category.id} category={category} variant='card' />
              ))}
            </div>
          </section>
        )}

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
              <div className={`mt-2 grid ${DESIGN_GRID[design]}`}>
                {subcategories.map((sub) => (
                  <CategoryTile
                    key={sub.id}
                    category={sub}
                    variant={design === 'b' ? 'card' : 'wide'}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
