import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  isShowCompany?: boolean;
}

export const ProductCardSkeleton = ({ isShowCompany = true }: Props) => {
  return (
    <Card className='@container w-full pt-0!' size='sm'>
      <div className='relative h-60'>
        <Skeleton className='size-full rounded-b-none' />
        <div className='absolute top-0 flex w-full items-center justify-between gap-2 p-3'>
          <Skeleton className='bg-background/80 h-6 w-24 rounded-full' />
          <Skeleton className='bg-background/80 size-8 rounded-full' />
        </div>
      </div>

      <CardContent className='space-y-3'>
        <div className='space-y-2'>
          <Skeleton className='h-3 w-32' />
          <Skeleton className='h-6 w-4/5' />
          {isShowCompany && <Skeleton className='h-3 w-16' />}
        </div>

        <div className='space-y-3 border-b pb-4'>
          <div className='flex items-baseline gap-1'>
            <Skeleton className='h-7 w-32' />
            <Skeleton className='h-3 w-12' />
          </div>
        </div>

        <div className='flex justify-between gap-2'>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-20' />
            <Skeleton className='h-4 w-16' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-3 w-18' />
            <Skeleton className='h-4 w-24' />
          </div>
        </div>

        <div className='grid gap-2 @[250px]:grid-cols-2'>
          <Skeleton className='h-9 w-full' />
          <Skeleton className='h-9 w-full' />
        </div>
      </CardContent>
    </Card>
  );
};
