import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import {
  CategorySidebar,
  CategoryTile,
  getPublicAllCategoriesOptions
} from '@/modules/category';

export const TopCategoriesSection = () => {
  const getPublicAllCategoriesQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const roots = getPublicAllCategoriesQuery.data ?? [];
  const [selectedId, setSelectedId] = useState<number | undefined>(roots[0]?.id);
  const selected = roots.find((root) => root.id === selectedId) ?? roots[0];
  const tiles = selected?.children ?? [];

  return (
    <div className='flex flex-col gap-6 md:flex-row'>
      <CategorySidebar roots={roots} selectedId={selected?.id} onSelect={setSelectedId} />
      <div className='min-w-0 flex-1'>
        {selected && (
          <>
            <p className='text-primary text-xl font-semibold'>{selected.name}</p>
            <div className='mt-3 grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 xl:grid-cols-8'>
              {tiles.map((child) => (
                <CategoryTile key={child.id} category={child} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
