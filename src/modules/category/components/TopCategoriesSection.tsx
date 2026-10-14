import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Suspense, useMemo, useState } from 'react';

import {
  CategorySidebar,
  CategoryTile,
  getPublicAllCategoriesOptions,
  getPublicCategoryByIdOptions
} from '@/modules/category';
import { generateSlugId } from '@/shared/constants';
import { Skeleton } from '@/shared/ui/skeleton';

const SectionSubcategories = ({ sectionId }: { sectionId: number }) => {
  const detailQuery = useSuspenseQuery(getPublicCategoryByIdOptions({ id: sectionId }));
  const subcategories = detailQuery.data?.children ?? [];

  return (
    <ul className='columns-1 gap-6 sm:columns-2 lg:columns-3'>
      {subcategories.map((sub) => (
        <li key={sub.id} className='break-inside-avoid py-1'>
          <Link
            className='text-primary text-[15px] font-medium hover:underline'
            params={{ slug: generateSlugId(sub.id, sub.name) }}
            to='/catalog/$slug'
          >
            {sub.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const SectionSubcategoriesFallback = () => (
  <div className='space-y-2'>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton key={index} className='h-5 w-2/3' />
    ))}
  </div>
);

export const TopCategoriesSection = () => {
  const { t } = useLingui();
  const getPublicAllCategoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const sections = useMemo(
    () => (getPublicAllCategoriesQuery.data ?? []).flatMap((group) => group.children ?? []),
    [getPublicAllCategoriesQuery.data]
  );
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const selected = sections.find((section) => section.id === selectedId);

  return (
    <div className='flex flex-col gap-6 md:flex-row'>
      <CategorySidebar roots={sections} selectedId={selected?.id} onSelect={setSelectedId} />
      <div className='min-w-0 flex-1'>
        {selected ? (
          <>
            <p className='text-primary text-xl font-semibold'>{selected.name}</p>
            <div className='mt-3'>
              <Suspense fallback={<SectionSubcategoriesFallback />}>
                <SectionSubcategories sectionId={selected.id} />
              </Suspense>
            </div>
          </>
        ) : (
          <>
            <p className='text-primary text-xl font-semibold'>{t`All categories`}</p>
            <div className='mt-3 grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 xl:grid-cols-8'>
              {sections.map((section) => (
                <CategoryTile key={section.id} category={section} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
