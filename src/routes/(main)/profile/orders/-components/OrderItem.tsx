import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';

import { useAuth } from '@/modules/auth';
import { currencySymbolMap } from '@/modules/currency';
import { orderStatusColorMap, orderStatusLabelMap } from '@/modules/order';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
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
  const { user } = useAuth();

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
          <CardAction className='flex flex-col items-end gap-2'>
            <Badge
              style={{
                backgroundColor: `${orderStatusColorMap[order.status]}20`,
                color: orderStatusColorMap[order.status]
              }}
            >
              {t(orderStatusLabelMap[order.status])}
            </Badge>
            {formatPrice(totalPrice)} {user?.currency && currencySymbolMap[user.currency]}
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='flex gap-3 overflow-y-auto'>
            {order.items.map((item) => (
              <div key={item.variant.id} className='shrink-0'>
                <img
                  alt={item.variant.sku_variant}
                  className='bg-muted size-20 rounded-md object-contain'
                  src={item.variant.medias[0]?.file}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
