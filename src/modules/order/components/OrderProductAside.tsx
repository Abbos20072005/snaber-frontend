import { useLingui } from '@lingui/react/macro';
import { PackagePlusIcon } from 'lucide-react';

import { useAuthed } from '@/modules/auth';
import { currencySymbolMap } from '@/modules/currency';
import { orderStatusColorMap, orderStatusLabelMap } from '@/modules/order';
import { OrderProductItem } from '@/modules/products';
import { formatPrice } from '@/shared/lib/format.ts';
import { Badge } from '@/shared/ui/badge.tsx';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip.tsx';

interface Props {
  isLoading?: boolean;
  order?: Order | null;
}

export const OrderProductAside = ({ isLoading = false, order }: Props) => {
  const { t } = useLingui();
  const products = order?.items ?? [];

  const acceptedBySeller = order?.accepted_by_seller;
  const rejectedBySeller = order?.rejected_by_seller;
  const acceptedByBuyer = order?.accepted_by_buyer;
  const rejectedByBuyer = order?.rejected_by_buyer;

  const isBoth =
    (!!acceptedByBuyer && !!acceptedBySeller) || (!!rejectedByBuyer && !!rejectedBySeller);

  const { user } = useAuthed();

  return (
    <aside className='bg-card flex h-full min-h-0 flex-col overflow-hidden rounded-lg'>
      <div className='flex items-center gap-2 px-5 pt-5 pb-4'>
        <span className='bg-primary/10 text-primary inline-flex size-7 items-center justify-center rounded-md'>
          <PackagePlusIcon className='size-4' />
        </span>
        <h2 className='flex-1 text-lg font-semibold'>
          {t`Order`} #{order?.id}
        </h2>
        {order && (
          <div className='flex flex-1 shrink flex-wrap justify-end gap-1'>
            {order.is_closed && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant='default'>{t`Order closed`}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {t`The order is closed, you can't edit it anymore.`}
                </TooltipContent>
              </Tooltip>
            )}
            {!isBoth && (
              <Badge
                style={{
                  color: orderStatusColorMap[order.status],
                  backgroundColor: `${orderStatusColorMap[order.status]}20`
                }}
                className='capitalize'
              >
                {t(orderStatusLabelMap[order.status])}
              </Badge>
            )}
            {acceptedBySeller && !isBoth && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant='success'>{t`Accepted by seller`}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {user.role === 'seller'
                    ? t`Seller accepted the order, waiting for buyer's response.`
                    : t`Seller accepted the order. Click accept to confirm your acceptance.`}
                </TooltipContent>
              </Tooltip>
            )}
            {rejectedBySeller && !isBoth && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant='destructive'>{t`Rejected by seller`}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {user.role === 'seller'
                    ? t`Seller rejected the order, waiting for buyer's response.`
                    : t`Seller rejected the order. Click reject to confirm your rejection.`}
                </TooltipContent>
              </Tooltip>
            )}
            {acceptedByBuyer && !isBoth && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant='success'>{t`Accepted by buyer`}</Badge>
                </TooltipTrigger>
                <TooltipContent>{t`Buyer accepted the order.`}</TooltipContent>
              </Tooltip>
            )}
            {rejectedByBuyer && !isBoth && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant='destructive'>{t`Rejected by buyer`}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {user.role === 'seller'
                    ? t`Buyer rejected the order too, the order is canceled.`
                    : t`You rejected the order, the order is canceled.`}
                </TooltipContent>
              </Tooltip>
            )}
            {isBoth && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant={order.status === 'accepted' ? 'success' : 'destructive'}>
                    {order.status === 'accepted' ? t`Both accepted` : t`Both rejected`}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {order.status === 'accepted'
                    ? t`Both accepted, the order is completed.`
                    : t`Both rejected, the order is canceled.`}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto px-5 pb-5'>
        <p className='mb-2 font-medium'>
          {t`Total price`}: {formatPrice(order?.total_price ?? 0)}{' '}
          {user.currency && currencySymbolMap[user.currency]}
        </p>

        <p className='text-muted-foreground mb-2 text-xs font-medium'>{t`Selected products`}</p>

        <div className='flex flex-col gap-2.5'>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='bg-background flex items-center gap-3 rounded-lg border p-2'
              >
                <Skeleton className='size-11 shrink-0 rounded-md' />
                <div className='min-w-0 flex-1 space-y-2'>
                  <Skeleton className='h-4 w-36' />
                  <Skeleton className='h-3 w-24' />
                </div>
                <Skeleton className='h-8 w-20' />
              </div>
            ))
          ) : !order || products.length === 0 ? (
            <div className='text-muted-foreground flex min-h-40 items-center justify-center rounded-md border border-dashed p-5 text-center text-sm'>
              {order ? t`No products in this order.` : t`Select an order to view products.`}
            </div>
          ) : (
            products.map((item) => (
              <OrderProductItem key={item.variant.id} item={item} company={order.company} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
