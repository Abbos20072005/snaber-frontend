import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';

import { STATIC_CATEGORY_IMAGES } from '../static-images';

// Grid that holds the cards of the subcategory pages.
export const CATEGORY_CARD_GRID = 'grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3';

export const CategoryCard = ({ category }: { category: Category }) => {
  const { t } = useLingui();
  const image = category.image || STATIC_CATEGORY_IMAGES[category.code];
  const productsCount = category.products_count;

  return (
    <Link
      className='bg-background flex gap-3 rounded-lg border p-3 transition-colors hover:border-yellow-400 hover:bg-yellow-400/25'
      params={{ slug: generateSlugId(category.id, category.name) }}
      to='/catalog/$slug'
    >
      {image ? (
        <img
          alt={category.name}
          className='bg-background size-24 shrink-0 rounded-md object-cover'
          src={image}
          decoding='async'
          loading='lazy'
        />
      ) : (
        <span className='bg-muted/60 flex size-24 shrink-0 items-center justify-center rounded-md'>
          <ImageIcon className='text-muted-foreground/60 size-8' />
        </span>
      )}
      <div className='flex min-w-0 flex-1 flex-col justify-center gap-1'>
        <span className='line-clamp-3 text-sm leading-snug font-semibold'>{category.name}</span>
        {productsCount !== undefined && (
          <span className='text-muted-foreground text-sm'>{t`${productsCount} products`}</span>
        )}
      </div>
    </Link>
  );
};
