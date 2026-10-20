import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PackageIcon } from 'lucide-react';

import { getOrdersInfiniteQueryOptions, OrderCard } from '@/modules/order';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { PageContent } from '@/shared/ui/page';
import { Skeleton } from '@/shared/ui/skeleton';

export const OrdersPage = () => {
  const { t } = useLingui();

  const ordersQuery = useInfiniteQuery(
    getOrdersInfiniteQueryOptions({ params: { page_size: 20 } })
  );
  const orders = ordersQuery.data?.pages.flatMap((item) => item.data.results) ?? [];

  return (
    <PageContent className='mx-auto w-full max-w-4xl space-y-4'>
      <h1 className='text-primary text-2xl font-semibold'>{t`Orders`}</h1>

      {ordersQuery.isLoading &&
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className='h-60 w-full rounded-lg' />
        ))}

      {!ordersQuery.isLoading && orders.length === 0 && (
        <Empty className='w-full'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <PackageIcon className='text-muted-foreground' />
            </EmptyMedia>
            <EmptyTitle>{t`No orders yet`}</EmptyTitle>
            <EmptyDescription>{t`New orders will appear here.`}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {ordersQuery.hasNextPage && (
        <div className='flex justify-center'>
          <Button
            type='button'
            variant='outline'
            loading={ordersQuery.isFetchingNextPage}
            onClick={() => ordersQuery.fetchNextPage()}
          >
            {t`Load more`}
          </Button>
        </div>
      )}
    </PageContent>
  );
};
