import { useLingui } from '@lingui/react/macro';
import { ListFilterIcon } from 'lucide-react';

import { OrderProductAside, OrdersList, OrderStatusDropdown } from '@/modules/order';
import { Button } from '@/shared/ui/button';

interface Props {
  activeOrderId: number | null;
  isOrderDetailsLoading: boolean;
  isOrdersEmpty: boolean;
  isOrdersListLoading: boolean;
  isOrdersSheetOpen: boolean;
  orders: Order[];
  selectedOrder: Order | null;
  onCloseOrdersSheet: () => void;
  onOpenOrdersSheet: () => void;
  onSelectOrder: (orderId: number) => void;
}

export const AdminOrdersContent = ({
  activeOrderId,
  isOrderDetailsLoading,
  isOrdersEmpty,
  isOrdersListLoading,
  isOrdersSheetOpen,
  orders,
  selectedOrder,
  onCloseOrdersSheet,
  onOpenOrdersSheet,
  onSelectOrder
}: Props) => {
  const { t } = useLingui();
  const visibleOrder = isOrdersEmpty ? null : selectedOrder;

  return (
    <>
      <Button
        className='2xl:hidden'
        size='sm'
        type='button'
        variant='outline'
        onClick={onOpenOrdersSheet}
      >
        <ListFilterIcon />
        {t`All orders`}
      </Button>
      {isOrdersSheetOpen ? (
        <>
          <div
            className='absolute inset-0 size-full backdrop-blur-[1px]'
            onClick={onCloseOrdersSheet}
          />
          <div className='absolute inset-0 left-0 w-[min(380px,calc(100vw-48px))] 2xl:hidden'>
            <OrdersList
              className='h-[calc(100vh-142px)] rounded-none shadow-xl'
              selectedOrderId={activeOrderId}
              isLoading={isOrdersListLoading}
              onSelectOrder={onSelectOrder}
              orders={orders}
            />
          </div>
        </>
      ) : null}
      <div className='grid grid-cols-[minmax(0,1fr)] gap-4 2xl:grid-cols-[360px_minmax(0,1fr)]'>
        <OrdersList
          className='hidden h-[calc(100vh-142px)] overflow-y-auto 2xl:block 2xl:h-[calc(100vh-93px)]'
          selectedOrderId={activeOrderId}
          isLoading={isOrdersListLoading}
          onSelectOrder={onSelectOrder}
          orders={orders}
        />
        <section className='flex h-[calc(100vh-142px)] min-h-0 flex-col overflow-hidden rounded-lg border 2xl:h-[calc(100vh-93px)]'>
          <div className='bg-card flex items-center justify-between gap-3 border-b px-5 py-3'>
            <div>
              <p className='text-sm font-semibold'>{t`Order details`}</p>
              <p className='text-muted-foreground text-xs'>
                {activeOrderId ? t`Order #${activeOrderId}` : t`No order selected`}
              </p>
            </div>
            <OrderStatusDropdown order={visibleOrder} />
          </div>
          <div className='min-h-0 flex-1'>
            <OrderProductAside isLoading={isOrderDetailsLoading} order={visibleOrder} />
          </div>
        </section>
      </div>
    </>
  );
};
