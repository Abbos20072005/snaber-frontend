import { useLingui } from '@lingui/react/macro';

import { CommentRating } from '@/modules/comment';
import { formatLocaleDate } from '@/shared/lib/format.ts';

export const CommentCard = ({ comment }: { comment: Comment }) => {
  const { t } = useLingui();

  return (
    <article className='bg-card flex h-full flex-col rounded-lg border p-5 shadow-xs'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h3 className='text-foreground truncate text-sm font-semibold'>
            {comment.user.full_name}
          </h3>
          <p className='text-muted-foreground mt-1 text-xs'>
            {formatLocaleDate(comment.created_at, 'PP')}
          </p>
        </div>
        <CommentRating rating={comment.rating} />
      </div>
      <p className='text-foreground mt-3 line-clamp-3 text-sm'>
        <span className='font-semibold'>{t`Comment`}:</span> {comment.text}
      </p>
    </article>
  );
};
