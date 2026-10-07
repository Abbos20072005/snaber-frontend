import { Skeleton } from '@/shared/ui/skeleton';

const widths = ['w-3/4', 'w-1/2', 'w-2/3', 'w-4/5', 'w-3/5'];

const FaqItemSkeleton = ({ index }: { index: number }) => (
  <div className='border-b py-4'>
    <Skeleton className={`h-5 ${widths[index % widths.length]}`} />
  </div>
);

export const FaqsSkeleton = ({ count = 6 }: { count?: number }) => {
  const items = Array.from({ length: count });
  const half = Math.floor(count / 2);

  return (
    <div className='grid lg:grid-cols-2 lg:gap-10'>
      <div className='block lg:hidden'>
        {items.map((_, i) => <FaqItemSkeleton key={i} index={i} />)}
      </div>
      <div className='hidden lg:block'>
        {items.slice(0, half).map((_, i) => <FaqItemSkeleton key={i} index={i} />)}
      </div>
      <div className='hidden lg:block'>
        {items.slice(half).map((_, i) => <FaqItemSkeleton key={i} index={i + half} />)}
      </div>
    </div>
  );
};
