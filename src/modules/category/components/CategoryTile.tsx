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
      className='group/tile bg-background flex flex-col gap-2 rounded-xl border p-2 transition-colors hover:border-yellow-400 hover:bg-yellow-400/25'
      params={{ slug: generateSlugId(category.id, category.name) }}
      to='/catalog/$slug'
    >
      {image ? (
        <img
          alt={category.name}
          className='bg-background aspect-square w-full rounded-lg object-contain'
          src={image}
          decoding='async'
          loading='lazy'
        />
      ) : (
        <span className='bg-background flex aspect-square w-full items-center justify-center rounded-lg'>
          <ImageIcon className='text-muted-foreground/60 size-8' />
        </span>
      )}
      <span className='text-foreground/80 line-clamp-3 px-0.5 pb-1 text-center text-[13px] leading-snug group-hover/tile:text-black'>
        {category.name}
        {category.products_count !== undefined && (
          <span className='text-muted-foreground group-hover/tile:text-black/70'>
            {' '}
            ({category.products_count})
          </span>
        )}
      </span>
    </Link>
  );
};
