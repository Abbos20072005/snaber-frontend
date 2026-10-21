import { Skeleton } from '@/shared/ui/skeleton';

const SIDEBAR_ROWS = 10;
const SECTIONS = 2;
const TILES_PER_SECTION = 6;

const HeadingSkeleton = ({ width }: { width: string }) => (
  <div className='border-border flex h-9 items-end border-b-2 pb-1.5'>
    <Skeleton className={`h-5 ${width}`} />
  </div>
);

// Mirrors TopCategoriesSection: sidebar on the left, headed tile grids on the right.
export const TopCategoriesSkeleton = () => (
  <div className='flex flex-col gap-6 md:flex-row'>
    <aside className='shrink-0 self-start md:w-55'>
      <HeadingSkeleton width='w-32' />
      <div className='mt-1 flex gap-1 overflow-hidden py-1 md:flex-col'>
        {Array.from({ length: SIDEBAR_ROWS }).map((_, index) => (
          <Skeleton key={index} className='h-8 w-28 shrink-0 md:w-full' />
        ))}
      </div>
    </aside>
    <div className='min-w-0 flex-1 space-y-3'>
      <HeadingSkeleton width='w-40' />
      {Array.from({ length: SECTIONS }).map((_, section) => (
        <section key={section}>
          <div className='border-b pb-2'>
            <Skeleton className='h-6 w-48' />
          </div>
          <div className='mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
            {Array.from({ length: TILES_PER_SECTION }).map((_, tile) => (
              <div key={tile} className='bg-muted/70 flex items-center gap-2 rounded-lg p-2'>
                <Skeleton className='size-9 shrink-0 rounded-md' />
                <Skeleton className='h-3 w-2/3' />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);
