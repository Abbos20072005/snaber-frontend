import { Skeleton } from '@/shared/ui/skeleton';

const CommentCardSkeleton = () => (
  <article className='bg-card flex h-full flex-col rounded-lg border p-5 shadow-xs'>
    <div className='flex items-start justify-between gap-2'>
      <div className='min-w-0'>
        <Skeleton className='h-3 w-24' />
        <Skeleton className='mt-1 h-2 w-28' />
      </div>
      <div className='flex gap-1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='size-4 rounded-sm' />
        ))}
      </div>
    </div>

    <div className='mt-3 space-y-2'>
      <Skeleton className='h-3 w-full' />
      <Skeleton className='h-3 w-11/12' />
    </div>
  </article>
);

export const ProductCommentSectionSkeleton = () => {
  return (
    <section className='space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-6 w-44' />
        <Skeleton className='h-8 w-32' />
      </div>

      <div className='relative px-2 sm:px-4'>
        <div className='overflow-hidden p-1'>
          <div className='-ml-3 flex'>
            <div className='min-w-0 shrink-0 grow-0 basis-full pl-3 md:basis-1/2'>
              <CommentCardSkeleton />
            </div>
            <div className='hidden min-w-0 shrink-0 grow-0 basis-1/2 pl-3 md:block'>
              <CommentCardSkeleton />
            </div>
          </div>
        </div>

        <div className='pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between md:flex'>
          <Skeleton className='size-8 rounded-full' />
          <Skeleton className='size-8 rounded-full' />
        </div>
      </div>
    </section>
  );
};
