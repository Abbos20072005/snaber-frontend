import { useLingui } from '@lingui/react/macro';
import { PackageIcon } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { OrderProductItem } from '@/modules/products';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatLocaleDate, formatPhoneNumber, formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { OrderCustomItemRow } from './OrderCustomItemRow';
import { ReorderButton } from './ReorderButton';

interface Props {
  order: Order;
}

export const OrderCard = ({ order }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();

  // Admins see every buyer's orders, only the buyer can put an order back into their own cart.
  const isOwnOrder = user?.id === order.buyer.id;
  const buyerName = order.buyer.full_name || order.buyer.phone_number;

  return (
    <Card>
      <CardHeader className='flex flex-wrap items-start justify-between gap-3 border-b'>
        <div className='flex items-center gap-3'>
          <span className='bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-md'>
            <PackageIcon className='size-5' />
          </span>
          <div>
            <CardTitle className='text-lg'>
              {t`Order`} #{order.id}
            </CardTitle>
            <CardDescription>{formatLocaleDate(order.created_at, 'PP HH:mm')}</CardDescription>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-sm font-medium'>{buyerName}</p>
          {order.buyer.phone_number && (
            <p className='text-muted-foreground text-xs'>
              {formatPhoneNumber(order.buyer.phone_number.replace('+', ''))}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='space-y-2.5'>
          {order.items.map((item) => (
            <OrderProductItem key={item.id} item={item} />
          ))}
          {order.custom_items.map((item) => (
            <OrderCustomItemRow key={item.id} item={item} />
          ))}
        </div>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          {isOwnOrder ? <ReorderButton orderId={order.id} /> : <span />}
          <p className='text-base font-semibold'>
            {t`Total price`}: {formatPrice(order.total_price)} {t(CURRENCY_SYMBOL)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
