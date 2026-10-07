import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ListFilterIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

// FEATURE DISABLED: Chat functionality.
// import { useAuthed } from '@/modules/auth';
// import { ChatConversationPanel, getConversationByOrderQueryOptions } from '@/modules/chat';
import {
  AdminOrdersContent,
  getOrderByIdQueryOptions,
  getOrdersInfiniteQueryOptions,
  OrderAddProductSheet,
  OrderProductAside,
  OrdersList,
  OrderStatusDropdown
} from '@/modules/order';
import { Button } from '@/shared/ui/button';
import { PageContent } from '@/shared/ui/page';

interface Props {
  mode: 'admin' | 'customer';
}

export const OrdersPage = ({ mode }: Props) => {
  const { t } = useLingui();
  // FEATURE DISABLED: Chat functionality.
  // const { user } = useAuthed();

  const ordersQuery = useInfiniteQuery(
    getOrdersInfiniteQueryOptions({ params: { page_size: 10 } })
  );

  const orders = useMemo(
    () => ordersQuery.data?.pages.flatMap((item) => item.data.results) ?? [],
    [ordersQuery.data?.pages]
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isOrdersSheetOpen, setIsOrdersSheetOpen] = useState<boolean>(false);
  const [isAddProductSheetOpen, setIsAddProductSheetOpen] = useState<boolean>(false);

  const activeOrderId =
    orders.find((order) => order.id === selectedOrderId)?.id ?? orders[0]?.id ?? null;

  const selectedOrderSummary = useMemo(
    () => orders.find((order) => order.id === activeOrderId) ?? null,
    [activeOrderId, orders]
  );

  const selectedOrderQuery = useQuery({
    ...getOrderByIdQueryOptions({ id: activeOrderId ?? 0 }),
    enabled: activeOrderId !== null
  });
  const selectedOrder = selectedOrderQuery.data?.data ?? selectedOrderSummary;

  // FEATURE DISABLED: Chat functionality.
  // const selectedConversationQuery = useQuery({
  //   ...getConversationByOrderQueryOptions({ orderId: activeOrderId ?? 0 }),
  //   enabled: mode === 'customer' && activeOrderId !== null
  // });
  //
  // const selectedConversation = selectedConversationQuery.data;
  const isOrderDetailsLoading = activeOrderId !== null && selectedOrderQuery.isLoading;
  const isOrdersEmpty = !ordersQuery.isLoading && orders.length === 0;

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsOrdersSheetOpen(false);
  };

  return (
    <>
      <PageContent className='relative space-y-4'>
        {mode === 'admin' ? (
          <AdminOrdersContent
            activeOrderId={activeOrderId}
            isOrdersEmpty={isOrdersEmpty}
            isOrdersSheetOpen={isOrdersSheetOpen}
            selectedOrder={selectedOrder}
            isOrderDetailsLoading={isOrderDetailsLoading}
            isOrdersListLoading={ordersQuery.isLoading}
            onCloseOrdersSheet={() => setIsOrdersSheetOpen(false)}
            onOpenOrdersSheet={() => setIsOrdersSheetOpen(true)}
            onSelectOrder={handleSelectOrder}
            orders={orders}
          />
        ) : (
          <>
            <Button
              className='2xl:hidden'
              size='sm'
              type='button'
              variant='outline'
              onClick={() => setIsOrdersSheetOpen(true)}
            >
              <ListFilterIcon />
              {t`All orders`}
            </Button>
            {isOrdersSheetOpen && (
              <>
                <div
                  className='absolute inset-0 size-full backdrop-blur-[1px]'
                  onClick={() => setIsOrdersSheetOpen(false)}
                />
                <div className='absolute inset-0 left-0 w-[min(380px,calc(100vw-48px))] 2xl:hidden'>
                  <OrdersList
                    className='h-[calc(100vh-142px)] rounded-none shadow-xl'
                    selectedOrderId={activeOrderId}
                    isLoading={ordersQuery.isLoading}
                    onSelectOrder={handleSelectOrder}
                    orders={orders}
                  />
                </div>
              </>
            )}
            <div className='grid grid-cols-[450px_minmax(0,1fr)] gap-4 2xl:grid-cols-[300px_minmax(0,1fr)]'>
              <OrdersList
                className='hidden h-[calc(100vh-142px)] overflow-y-auto 2xl:block 2xl:h-[calc(100vh-93px)]'
                selectedOrderId={activeOrderId}
                isLoading={ordersQuery.isLoading}
                onSelectOrder={handleSelectOrder}
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
                  <OrderStatusDropdown order={isOrdersEmpty ? null : selectedOrder} />
                </div>
                <div className='min-h-0 flex-1'>
                  <OrderProductAside
                    isLoading={isOrderDetailsLoading}
                    order={isOrdersEmpty ? null : selectedOrder}
                  />
                </div>
              </section>
              {/* FEATURE DISABLED: Chat functionality (order conversation panel). */}
              {/* <section className='flex h-[calc(100vh-142px)] min-h-0 flex-col overflow-hidden rounded-lg border 2xl:h-[calc(100vh-93px)]'> */}
              {/*   <div className='bg-card flex items-center justify-between gap-3 border-b px-5 py-3'> */}
              {/*     <div> */}
              {/*       <p className='text-sm font-semibold'>{t`Order conversation`}</p> */}
              {/*       <p className='text-muted-foreground text-xs'> */}
              {/*         {activeOrderId ? t`Order #${activeOrderId}` : t`No order selected`} */}
              {/*       </p> */}
              {/*     </div> */}
              {/*     <OrderStatusDropdown order={isOrdersEmpty ? null : selectedOrder} /> */}
              {/*   </div> */}
              {/*   <ChatConversationPanel */}
              {/*     className='min-h-0' */}
              {/*     currentUserId={user.id} */}
              {/*     conversation={isOrdersEmpty ? null : selectedConversation} */}
              {/*     isLoading={isOrderDetailsLoading} */}
              {/*   /> */}
              {/* </section> */}
            </div>
          </>
        )}
        <OrderAddProductSheet
          onOpenChange={setIsAddProductSheetOpen}
          open={isAddProductSheetOpen}
        />
      </PageContent>
    </>
  );
};
