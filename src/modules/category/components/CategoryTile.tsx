import { Link } from '@tanstack/react-router';

import { generateSlugId } from '@/shared/constants';

export const CategoryTile = ({ category }: { category: Category }) => (
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
    <span className='text-foreground/80 mt-1 block text-center text-[11px] leading-tight'>
      {category.name}
    </span>
  </Link>
);
