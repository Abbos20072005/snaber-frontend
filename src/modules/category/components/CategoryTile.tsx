import { Link } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';

export const CategoryTile = ({ category }: { category: Category }) => (
  <Link
    params={{ slug: generateSlugId(category.id, category.name) }}
    to='/catalog/$slug'
  >
    <span className='border-border block border bg-white p-0.5'>
      {category.image ? (
        <img
          alt={category.name}
          className='aspect-square w-full object-cover'
          loading='lazy'
          src={category.image}
        />
      ) : (
        <span className='bg-muted/40 flex aspect-square w-full items-center justify-center'>
          <ImageIcon className='text-muted-foreground/50 size-5' />
        </span>
      )}
    </span>
    <span className='text-foreground/80 mt-0.5 block text-center text-[10px] leading-tight'>
      {category.name}
    </span>
  </Link>
);
