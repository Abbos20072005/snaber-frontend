import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { PageContent } from '@/shared/ui/page';
import { Skeleton } from '@/shared/ui/skeleton';

const DetailRowsSkeleton = () => (
  <div>
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className='flex justify-between gap-4 border-b py-3'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-40' />
      </div>
    ))}
  </div>
);

const AsideCardSkeleton = () => (
  <Card className='rounded-lg py-0'>
    <CardContent className='space-y-6 p-6'>
      <div className='space-y-4'>
        <div className='flex gap-2.5'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-24 rounded-full' />
        </div>
        <div className='space-y-3'>
          <Skeleton className='h-7 w-3/4' />
          <Skeleton className='h-4 w-2/3' />
        </div>
      </div>
      <div className='space-y-2 border-t pt-6'>
        <Skeleton className='h-3 w-36' />
        <Skeleton className='h-9 w-56' />
        <Skeleton className='h-4 w-44' />
      </div>
      <div className='space-y-3'>
        <div className='flex justify-between gap-4'>
          <Skeleton className='h-5 w-28' />
          <Skeleton className='h-4 w-16' />
        </div>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className='grid grid-cols-[72px_1fr] gap-4 rounded-lg border p-3.5'>
            <Skeleton className='aspect-square rounded-md' />
            <div className='min-w-0 space-y-3'>
              <div className='flex justify-between gap-3'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-24' />
                </div>
                <Skeleton className='h-4 w-12 rounded-full' />
              </div>
              <div className='grid grid-cols-3 gap-3'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='flex gap-3'>
            <Skeleton className='size-9 rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className='h-11 w-full' />
      <Skeleton className='h-10 w-full' />
    </CardContent>
  </Card>
);

export const PublicProductDetailSkeleton = () => {
  return (
    <PageContent className='bg-background'>
      <div className='container space-y-6 py-6 lg:py-8'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='size-1 rounded-full' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='size-1 rounded-full' />
          <Skeleton className='h-4 w-40' />
        </div>

        <div className='grid grid-cols-[minmax(0,1fr)_minmax(420px,400px)] gap-8 lg:items-start'>
          <div className='space-y-6'>
            <div className='grid gap-3 md:grid-cols-[80px_minmax(0,1fr)] md:items-start'>
              <div className='hidden space-y-3 md:block'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className='size-18 rounded-md' />
                ))}
              </div>
              <Skeleton className='h-125 rounded-lg' />
            </div>

            <div className='space-y-4'>
              <div className='flex gap-6 border-b'>
                <Skeleton className='h-9 w-16 rounded-none' />
                <Skeleton className='h-9 w-28 rounded-none' />
                <Skeleton className='h-9 w-24 rounded-none' />
              </div>
              <Card className='rounded-lg'>
                <CardHeader>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='size-5' />
                    <Skeleton className='h-6 w-40' />
                  </div>
                </CardHeader>
                <CardContent>
                  <DetailRowsSkeleton />
                </CardContent>
              </Card>
            </div>
          </div>

          <aside className='space-y-6'>
            <AsideCardSkeleton />
            <Card className='rounded-lg'>
              <CardHeader>
                <Skeleton className='h-6 w-28' />
              </CardHeader>
              <CardContent className='space-y-5'>
                <div className='flex gap-4'>
                  <Skeleton className='size-12 rounded-lg' />
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-4 w-20' />
                  </div>
                </div>
                <div className='border-t pt-5'>
                  <div className='space-y-4'>
                    <Skeleton className='h-9 w-full' />
                    <Skeleton className='h-9 w-full' />
                    <Skeleton className='h-9 w-full' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </PageContent>
  );
};
