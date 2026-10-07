import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';

export const CompanyCardSkeleton = () => {
  return (
    <Card className='h-full' size='sm'>
      <CardHeader>
        <div className='mb-1 flex gap-2'>
          <Skeleton className='size-12 rounded-xl' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-5 w-4/5' />
            <div className='flex items-center gap-1'>
              <Skeleton className='size-3.5' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='flex flex-wrap gap-2'>
          <Skeleton className='h-6 w-20 rounded-full' />
          <Skeleton className='h-6 w-24 rounded-full' />
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-3'>
          <div className='w-full space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-12' />
          </div>
          <div className='w-full space-y-2'>
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-12' />
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex-1 justify-between gap-2'>
        <Skeleton className='h-9 w-28' />
        <Skeleton className='h-9 w-24' />
      </CardFooter>
    </Card>
  );
};
