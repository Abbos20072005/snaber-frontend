import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// FEATURE DISABLED: Chat functionality.
// import { useAuthed } from '@/modules/auth';
import { getOrderByIdQueryOptions, ORDER_QUERY_KEYS, OrderProductAside } from '@/modules/order';
import { patchOrder } from '@/shared/api';
import { formatLocaleDate } from '@/shared/lib/format';
import { Button, buttonVariants } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { PageLoading } from '@/shared/ui/page';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

const generateOrderLocalStorageKey = (orderId: number | string) => `order-${orderId}-alert-shown`;

const OrderDetailPage = () => {
  const { id } = useParams({ from: '/(main)/profile/orders/$id' });
  const { t } = useLingui();
  const getOrderQuery = useSuspenseQuery(getOrderByIdQueryOptions({ id: +id }));
  const order = getOrderQuery.data?.data;
  const acceptedBySeller = order.accepted_by_seller;
  const rejectedBySeller = order.rejected_by_seller;

  const [showAlertDialog, setShowAlertDialog] = useState<boolean>(() => {
    let shouldShow = false;

    const key = generateOrderLocalStorageKey(id);
    const value = localStorage.getItem(key);

    if (order.status === 'negotiation' && !acceptedBySeller && !rejectedBySeller) return false;
    else if (!value) shouldShow = true;
    else shouldShow = value === 'true';

    localStorage.setItem(key, 'false');
    return shouldShow;
  });

  // FEATURE DISABLED: Chat functionality.
  // const { user } = useAuthed();
  const queryClient = useQueryClient();

  // FEATURE DISABLED: Chat functionality.
  // const selectedConversationQuery = useSuspenseQuery(
  //   getConversationByOrderQueryOptions({ orderId: order.id })
  // );
  // const selectedConversation = selectedConversationQuery.data;

  const showAlertBtn = order.status === 'negotiation';
  // FEATURE DISABLED: Chat functionality.
  // const orderId = order.id;

  const patchOrderMutation = useMutation({
    mutationFn: patchOrder,
    onSuccess: () => {
      toast.success(t`Order status updated.`);
      setShowAlertDialog(false);
      void queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.base() });
    }
  });

  const handleAlertDialogConfirm = () => {
    const status: OrderStatus = acceptedBySeller ? 'accepted' : 'rejected';

    patchOrderMutation.mutate({
      id: order.id,
      data: {
        status
      }
    });
  };

  return (
    <section className='md container space-y-4 pb-5 md:w-full md:p-0'>
      <div className='flex items-center justify-between gap-3'>
        <Link
          className={buttonVariants({
            variant: 'ghost'
          })}
          to='/profile/orders'
        >
          <ArrowLeftIcon />
          {t`Back`}
        </Link>
        <div className='flex items-center gap-3'>
          {(acceptedBySeller || rejectedBySeller) && showAlertBtn && (
            <div>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={acceptedBySeller ? 'successLight' : 'destructiveLight'}
                    onClick={() => setShowAlertDialog(true)}
                  >
                    {acceptedBySeller ? t`Make a accept` : t`Make a reject`}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {acceptedBySeller
                    ? t`Seller accepted this order. Click to accept this order as a buyer.`
                    : t`Seller rejected this order. Click to reject this order as a buyer.`}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          <p className='text-sm font-medium'>{formatLocaleDate(order.created_at, 'PP HH:mm')}</p>
        </div>
      </div>
      <div className='grid gap-4'>
        <section className='min-h-0 rounded-lg border'>
          <OrderProductAside order={order} />
        </section>
        {/* FEATURE DISABLED: Chat functionality (order conversation panel). */}
        {/* <section className='flex min-h-0 flex-col overflow-hidden rounded-lg border lg:h-[calc(100vh-260px)] 2xl:h-[calc(100vh-230px)]'> */}
        {/*   <div className='bg-card flex items-center justify-between gap-3 border-b px-5 py-3'> */}
        {/*     <div> */}
        {/*       <p className='text-sm font-semibold'>{t`Order conversation`}</p> */}
        {/*       <p className='text-muted-foreground text-xs'>{t`Order #${orderId}`}</p> */}
        {/*     </div> */}
        {/*     {(acceptedBySeller || rejectedBySeller) && showAlertBtn && ( */}
        {/*       <div> */}
        {/*         <Tooltip> */}
        {/*           <TooltipTrigger> */}
        {/*             <Button */}
        {/*               variant={acceptedBySeller ? 'successLight' : 'destructiveLight'} */}
        {/*               onClick={() => setShowAlertDialog(true)} */}
        {/*             > */}
        {/*               {acceptedBySeller ? t`Make a accept` : t`Make a reject`} */}
        {/*             </Button> */}
        {/*           </TooltipTrigger> */}
        {/*           <TooltipContent> */}
        {/*             {acceptedBySeller */}
        {/*               ? t`Seller accepted this order. Click to accept this order as a buyer.` */}
        {/*               : t`Seller rejected this order. Click to reject this order as a buyer.`} */}
        {/*           </TooltipContent> */}
        {/*         </Tooltip> */}
        {/*       </div> */}
        {/*     )} */}
        {/*   </div> */}
        {/*   <ChatConversationPanel */}
        {/*     className='min-h-0' */}
        {/*     currentUserId={user.id} */}
        {/*     conversation={selectedConversation} */}
        {/*   /> */}
        {/* </section> */}
      </div>
      <ConfirmDialog
        cancelLabel={t`Cancel`}
        title={acceptedBySeller ? t`Accept order` : t`Reject order`}
        confirmLabel={acceptedBySeller ? t`Accept` : t`Reject`}
        confirmVariant={acceptedBySeller ? 'success' : 'destructive'}
        description={
          acceptedBySeller
            ? t`Seller accepted this order. Are you sure you want to accept this order too?`
            : t`Seller rejected this order. Are you sure you want to reject this order?`
        }
        onConfirm={handleAlertDialogConfirm}
        onOpenChange={setShowAlertDialog}
        open={showAlertDialog}
      />
    </section>
  );
};

export const Route = createFileRoute('/(main)/profile/orders/$id')({
  component: OrderDetailPage,
  pendingComponent: PageLoading,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
