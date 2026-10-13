import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import {
  getPublicAllCategoriesOptions
} from '@/modules/category';
import { generateSlugId } from '@/shared/constants';
import { Skeleton } from '@/shared/ui/skeleton';

const CategoryDirectorySkeleton = () => (
  <div className='columns-1 gap-8 sm:columns-2 lg:columns-3'>
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className='mb-6 space-y-2 break-inside-avoid'>
        <Skeleton className='h-5 w-2/3' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-2/5' />
      </div>
    ))}
  </div>
);

export const CategoryDirectory = () => {
  const rootsQuery = useSuspenseQuery(getPublicAllCategoriesOptions());
  const roots = rootsQuery.data ?? [];

  return (
    <div className='columns-1 gap-8 sm:columns-2 lg:columns-3'>
      {roots.map((root) => {
        const children = root.children ?? [];

        return (
          <div key={root.id} className='mb-6 break-inside-avoid'>
            <Link
              className='text-primary text-[15px] font-semibold hover:underline'
              params={{ slug: generateSlugId(root.id, root.name) }}
              to='/catalog/$slug'
            >
              {root.name}
            </Link>
            {children.length > 0 && (
              <ul className='mt-1.5 space-y-1'>
                {children.map((child) => (
                  <li key={child.id}>
                    <Link
                      className='text-primary/90 text-sm hover:underline'
                      params={{ slug: generateSlugId(child.id, child.name) }}
                      to='/catalog/$slug'
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { CategoryDirectorySkeleton };
