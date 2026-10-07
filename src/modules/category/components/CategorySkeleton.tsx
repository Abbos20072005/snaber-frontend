import { cn } from '@/shared/lib/utils.ts';
import { Card, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  className?: string;
}

export const CategorySkeleton = ({ className }: Props) => {
  return (
    <Card className={cn('border-primary h-full', className)} size='sm'>
      <Skeleton className='aspect-video w-full rounded-b-none' />
      <CardHeader>
        <Skeleton className='mx-auto h-6 w-3/4' />
      </CardHeader>
    </Card>
  );
};
