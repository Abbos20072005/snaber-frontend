import { Link } from '@tanstack/react-router';
import { ImageIcon } from 'lucide-react';

import { generateSlugId } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';

import { STATIC_CATEGORY_IMAGES } from '../static-images';

// compact: small icon + name; wide: design A (big image left); card: design B (image on top).
export type CategoryTileVariant = 'card' | 'compact' | 'wide';

const TILE_CLASSES: Record<CategoryTileVariant, string> = {
  compact: 'flex items-center gap-2 rounded-lg p-2',
  wide: 'flex min-h-23 items-center gap-3.5 rounded-xl p-2.5',
  card: 'flex flex-col gap-2 rounded-xl p-2'
};

const IMAGE_CLASSES: Record<CategoryTileVariant, string> = {
  compact: 'size-9 shrink-0 rounded-md',
  wide: 'size-18 shrink-0 rounded-lg',
  card: 'aspect-square w-full rounded-lg'
};

const NAME_CLASSES: Record<CategoryTileVariant, string> = {
  compact: 'text-foreground/80 line-clamp-2 text-xs leading-tight',
  wide: 'text-foreground/80 line-clamp-3 text-sm leading-snug',
  card: 'text-foreground/80 line-clamp-3 px-0.5 pb-1 text-center text-[13px] leading-snug'
};

export const CategoryTile = ({
  category,
  variant = 'compact'
}: {
  category: Category;
  variant?: CategoryTileVariant;
}) => {
  const image = category.image || STATIC_CATEGORY_IMAGES[category.code];

  return (
    <Link
      className={cn('bg-muted/70 hover:bg-muted transition-colors', TILE_CLASSES[variant])}
      params={{ slug: generateSlugId(category.id, category.name) }}
      to='/catalog/$slug'
    >
      {image ? (
        <img
          alt={category.name}
          className={cn('bg-background object-cover', IMAGE_CLASSES[variant])}
          src={image}
          loading='lazy'
        />
      ) : (
        <span
          className={cn(
            'bg-background flex items-center justify-center',
            IMAGE_CLASSES[variant]
          )}
        >
          <ImageIcon
            className={cn('text-muted-foreground/60', variant === 'compact' ? 'size-4' : 'size-8')}
          />
        </span>
      )}
      <span className={NAME_CLASSES[variant]}>{category.name}</span>
    </Link>
  );
};
