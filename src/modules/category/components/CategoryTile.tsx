import { Link } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';

import { STATIC_CATEGORY_IMAGES } from '../static-images';

// Grid that holds the tiles; shared by the home page and the subcategory pages.
export const CATEGORY_TILE_GRID = 'grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5';

export const CategoryTile = ({ category }: { category: Category }) => {
  const image = category.image || STATIC_CATEGORY_IMAGES[category.code];

  return (
    <Link
      className='bg-muted/70 hover:bg-muted flex flex-col gap-2 rounded-xl p-2 transition-colors'
      params={{ slug: generateSlugId(category.id, category.name) }}
      to='/catalog/$slug'
    >
      {image ? (
        <img
          alt={category.name}
          className='bg-background aspect-square w-full rounded-lg object-cover'
          src={image}
          loading='lazy'
        />
      ) : (
        <span className='bg-background flex aspect-square w-full items-center justify-center rounded-lg'>
          <ImageIcon className='text-muted-foreground/60 size-8' />
        </span>
      )}
      <span className='text-foreground/80 line-clamp-3 px-0.5 pb-1 text-center text-[13px] leading-snug'>
        {category.name}
      </span>
    </Link>
  );
};
