import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  isShowCompany?: boolean;
}

export const ProductCardSkeleton = ({ isShowCompany = true }: Props) => {
  return (
    <Card className='h-full p-2' size='sm'>
      <div className='flex gap-2'>
        <Skeleton className='h-20 w-20 shrink-0 rounded-md sm:h-24 sm:w-24' />
        <CardContent className='flex min-w-0 flex-1 flex-col p-0'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='mt-1 h-4 w-4/5' />
          {isShowCompany && <Skeleton className='mt-1 h-3 w-20' />}
          <Skeleton className='mt-auto h-5 w-24 pt-1' />
          <Skeleton className='mt-1.5 h-8 w-full' />
        </CardContent>
      </div>
    </Card>
  );
};
