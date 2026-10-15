import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  isShowCompany?: boolean;
}

export const ProductCardSkeleton = ({ isShowCompany = true }: Props) => {
  return (
    <Card className='w-full p-3 sm:p-4' size='sm'>
      <div className='flex gap-3 sm:gap-4'>
        <Skeleton className='h-24 w-24 shrink-0 rounded-lg sm:h-32 sm:w-32' />
        <CardContent className='flex min-w-0 flex-1 flex-col p-0'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='mt-1.5 h-5 w-4/5' />
          {isShowCompany && <Skeleton className='mt-1 h-3 w-24' />}
          <div className='mt-auto flex items-end justify-between gap-2 pt-2'>
            <Skeleton className='h-7 w-32' />
            <Skeleton className='h-9 w-24' />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
