import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

import { getPublicAllCategoriesOptions } from '@/modules/category';
import { generateSlugId } from '@/shared/constants';

const CategoryTile = ({ category }: { category: Category }) => (
  <Link
    params={{ slug: generateSlugId(category.id, category.name) }}
    to='/catalog/$slug'
  >
    <span className='border-border block border bg-white p-1'>
      <img
        alt={category.name}
        className='aspect-square w-full object-cover'
        loading='lazy'
        src={category.image}
      />
    </span>
    <span className='text-foreground/80 mt-1 block text-center text-xs leading-tight'>
      {category.name}
    </span>
  </Link>
);

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
