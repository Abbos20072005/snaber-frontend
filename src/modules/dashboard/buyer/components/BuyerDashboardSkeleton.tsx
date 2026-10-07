import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

const ChartCardSkeleton = ({ className }: { className?: string }) => (
  <Card className={className}>
    <CardHeader>
      <Skeleton className='h-5 w-40' />
      <Skeleton className='h-4 w-64 max-w-full' />
    </CardHeader>
    <CardContent>
      <Skeleton className='h-64 w-full' />
    </CardContent>
  </Card>
);

const MetricCardSkeleton = () => (
  <Card className='rounded-lg'>
    <CardHeader>
      <div className='flex items-center justify-between gap-3'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='size-8 rounded-lg' />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className='h-8 w-24' />
      <Skeleton className='mt-3 h-4 w-44 max-w-full' />
    </CardContent>
  </Card>
);

const InsightCardSkeleton = () => (
  <Card className='rounded-lg'>
    <CardContent className='flex items-start gap-3 p-4'>
      <Skeleton className='size-10 shrink-0 rounded-lg' />
      <div className='min-w-0 flex-1'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='mt-2 h-8 w-16' />
        <Skeleton className='mt-3 h-4 w-full' />
      </div>
    </CardContent>
  </Card>
);

export const BuyerDashboardSkeleton = () => (
  <section className='space-y-4'>
    <Skeleton className='h-34 rounded-xl' />

    <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </div>

    <div className='grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]'>
      <ChartCardSkeleton className='rounded-lg' />
      <ChartCardSkeleton className='rounded-lg' />
    </div>

    <div className='grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]'>
      <ChartCardSkeleton className='rounded-lg' />
      <ChartCardSkeleton className='rounded-lg' />
    </div>

    <div className='grid gap-4 lg:grid-cols-3'>
      {Array.from({ length: 3 }).map((_, index) => (
        <InsightCardSkeleton key={index} />
      ))}
    </div>
  </section>
);
