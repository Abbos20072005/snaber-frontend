import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  isShowCompany?: boolean;
}

export const ProductCardSkeleton = ({ isShowCompany = true }: Props) => {
  return (
    <Card className='flex h-full flex-col gap-3 p-3 sm:p-4' size='sm'>
      <Skeleton className='aspect-[4/3] w-full rounded-lg' />
      <CardContent className='flex min-w-0 flex-1 flex-col p-0'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='mt-1.5 h-5 w-4/5' />
        {isShowCompany && <Skeleton className='mt-1 h-3 w-24' />}
        <Skeleton className='mt-auto h-7 w-32 pt-2' />
        <Skeleton className='mt-2 h-9 w-full' />
      </CardContent>
    </Card>
  );
};
