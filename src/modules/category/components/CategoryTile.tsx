import { Link } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';

export const CategoryTile = ({ category }: { category: Category }) => (
  <Link
    className='bg-muted/70 hover:bg-muted flex items-center gap-2 rounded-lg p-2 transition-colors'
    params={{ slug: generateSlugId(category.id, category.name) }}
    to='/catalog/$slug'
  >
    {category.image ? (
      <img
        alt={category.name}
        className='size-9 shrink-0 rounded-md object-cover'
        src={category.image}
        loading='lazy'
      />
    ) : (
      <span className='bg-background flex size-9 shrink-0 items-center justify-center rounded-md'>
        <ImageIcon className='text-muted-foreground/60 size-4' />
      </span>
    )}
    <span className='text-foreground/80 line-clamp-2 text-xs leading-tight'>{category.name}</span>
  </Link>
);
