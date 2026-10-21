import { Link } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';

export const CategoryTile = ({ category }: { category: Category }) => (
  <Link
    className='bg-muted/70 hover:bg-muted flex flex-col overflow-hidden rounded-lg transition-colors'
    params={{ slug: generateSlugId(category.id, category.name) }}
    to='/catalog/$slug'
  >
    {category.image ? (
      <img
        alt={category.name}
        className='aspect-square w-full object-cover'
        src={category.image}
        loading='lazy'
      />
    ) : (
      <span className='bg-background flex aspect-square w-full items-center justify-center'>
        <ImageIcon className='text-muted-foreground/60 size-10' />
      </span>
    )}
    <span className='text-foreground/80 line-clamp-2 p-2 text-sm leading-tight'>{category.name}</span>
  </Link>
);
