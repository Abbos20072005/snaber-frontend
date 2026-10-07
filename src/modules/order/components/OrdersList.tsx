import type { ComponentProps } from 'react';

import { useLingui } from '@lingui/react/macro';

import { OrderListItem } from '@/modules/order';
import { Skeleton } from '@/shared/ui/skeleton';
interface Props {
  className?: ComponentProps<'aside'>['className'];
  isLoading?: boolean;
  orders: Order[];
  selectedOrderId: number | null;
  onSelectOrder: (orderId: number) => void;
}

export const OrdersList = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  className,
  isLoading = false
}: Props) => {
  const { t } = useLingui();
  const ordersCount = orders.length;

  return (
    <aside className={`bg-card flex flex-col rounded-lg border ${className ?? ''}`}>
      <div className='border-b px-4 py-3'>
        <div className='flex items-center justify-between gap-3'>
          <h1 className='text-primary text-xl font-semibold'>{t`Orders`}</h1>
          <p className='text-muted-foreground mt-1 text-xs'>
            {t`${ordersCount} active buyer conversations`}
          </p>
        </div>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto p-2'>
        <div className='flex flex-col gap-2'>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='rounded-md border p-3'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0 flex-1 space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-3 w-32' />
                  </div>
                  <Skeleton className='h-3 w-16' />
                </div>
                <div className='mt-3 grid grid-cols-2 gap-2 border-t pt-3'>
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                </div>
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className='text-muted-foreground flex min-h-52 items-center justify-center rounded-md border border-dashed p-6 text-center text-sm'>
              {t`No orders found.`}
            </div>
          ) : (
            orders.map((order) => (
              <OrderListItem
                key={order.id}
                isActive={order.id === selectedOrderId}
                onSelect={onSelectOrder}
                order={order}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
