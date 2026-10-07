import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { getOrdersInfiniteQueryOptions } from '@/modules/order';
import { Button } from '@/shared/ui/button';

import { OrderItem } from './OrderItem';

export const OrdersList = () => {
  const { t } = useLingui();
  const search = useSearch({ strict: false });

  const ordersQuery = useInfiniteQuery(
    getOrdersInfiniteQueryOptions({ params: { page_size: 10, ...search } })
  );

  const orders = ordersQuery.data?.pages.flatMap((item) => item.data.results) ?? [];

  return (
    <div className='space-y-4 p-1'>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
      {ordersQuery.hasNextPage && (
        <div className='flex justify-center'>
          <Button
            size='sm'
            type='button'
            variant='outline'
            onClick={() => ordersQuery.fetchNextPage()}
          >
            {t`Load more`}
          </Button>
        </div>
      )}
    </div>
  );
};
