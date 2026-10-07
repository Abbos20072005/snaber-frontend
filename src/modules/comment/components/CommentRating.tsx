import { StarIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const MAX_RATING = 5;

export const CommentRating = ({ rating }: { rating: number }) => (
  <div aria-label={`${rating} / ${MAX_RATING}`} className='flex items-center gap-0.5'>
    {Array.from({ length: MAX_RATING }, (_, index) => {
      const isActive = index < Math.round(rating);

      return (
        <StarIcon
          key={index}
          className={cn('size-4 text-amber-400', isActive ? 'fill-amber-400' : 'fill-transparent')}
        />
      );
    })}
  </div>
);
