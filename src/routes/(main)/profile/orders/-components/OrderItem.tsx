import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';

import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

interface Props {
  order: Order;
}

export const OrderItem = ({ order }: Props) => {
  const { t } = useLingui();
  const totalPrice =
    order.total_price ||
    order.items.reduce((total, item) => total + Number(item.total_price || 0), 0);

  return (
    <Link className='group block' params={{ id: String(order.id) }} to='/profile/orders/$id'>
      <Card className='group-hover:bg-muted/50' size='sm'>
        <CardHeader className='border-b'>
          <CardTitle>
            {t`Order`} #{order.id}
          </CardTitle>
          <CardDescription>{format(order.created_at, 'dd.MM.yyyy')}</CardDescription>
          <CardAction>
            {formatPrice(totalPrice)} {CURRENCY_SYMBOL}
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='flex gap-3 overflow-y-auto'>
            {order.items.map((item) => (
              <div key={item.id} className='shrink-0'>
                <img
                  alt={item.product.name}
                  className='bg-muted size-20 rounded-md object-contain'
                  src={item.product.image ?? undefined}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
