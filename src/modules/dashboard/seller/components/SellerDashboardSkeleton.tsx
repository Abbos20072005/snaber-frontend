import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { PageContent } from '@/shared/ui/page';
import { Skeleton } from '@/shared/ui/skeleton';

const CardSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader>
      <Skeleton className='h-5 w-36' />
      <Skeleton className='h-4 w-56' />
    </CardHeader>
    <CardContent>
      <Skeleton className='h-60 w-full' />
    </CardContent>
  </Card>
);

export const SellerDashboardSkeleton = () => (
  <PageContent className='bg-muted/20'>
    <div className='space-y-6 p-6'>
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]'>
        <Skeleton className='h-58 rounded-lg xl:col-span-2' />
      </div>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-35 rounded-lg' />
        ))}
      </div>
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]'>
        <CardSkeleton className='rounded-lg' />
        <CardSkeleton className='rounded-lg' />
      </div>
      <div className='grid gap-4 xl:grid-cols-3'>
        <CardSkeleton className='rounded-lg xl:col-span-2' />
        <CardSkeleton className='rounded-lg' />
      </div>
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]'>
        <CardSkeleton className='rounded-lg' />
        <CardSkeleton className='rounded-lg' />
      </div>
    </div>
  </PageContent>
);
