import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  isShowCompany?: boolean;
}

export const ProductCardSkeleton = ({ isShowCompany = true }: Props) => {
  return (
    <Card className='w-full p-3 sm:p-5' size='sm'>
      <div className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
        <Skeleton className='mx-auto aspect-square w-full max-w-55 shrink-0 rounded-lg sm:mx-0 sm:w-48 lg:w-56' />
        <div className='min-w-0 flex-1 space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-6 w-4/5' />
          {isShowCompany && <Skeleton className='h-3 w-28' />}
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-4 w-2/5' />
        </div>
        <div className='shrink-0 space-y-2 sm:w-52 lg:w-60'>
          <Skeleton className='h-8 w-36' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    </Card>
  );
};
