import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export const UnitsOfMeasureCardsSkeleton = () => (
  <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6'>
    {Array.from({ length: 12 }).map((_, index) => (
      <Card key={index} className='rounded-lg py-4'>
        <CardContent className='flex items-center gap-3 px-4'>
          <Skeleton className='size-10 rounded-lg' />
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-20' />
          </div>
          <Skeleton className='size-9 rounded-md' />
        </CardContent>
      </Card>
    ))}
  </div>
);
