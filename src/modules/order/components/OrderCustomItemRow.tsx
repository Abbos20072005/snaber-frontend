import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { useAuth } from '@/modules/auth';
import { patchOrderCustomItem } from '@/shared/api';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

import { ORDER_QUERY_KEYS } from '../options';

interface Props {
  item: OrderCustomItem;
}

// A product the buyer wrote by himself. The admin sets its price, until then it is not in the total.
export const OrderCustomItemRow = ({ item }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();
  const [price, setPrice] = useState(item.price ?? '');

  const priceMutation = useMutation({
    mutationFn: () => patchOrderCustomItem({ id: item.id, data: { price: +price } }),
    meta: {
      invalidatesQuery: ORDER_QUERY_KEYS.base()
    }
  });

  return (
    <Card size='sm'>
      <CardContent className='flex flex-wrap items-center gap-4'>
        <div className='min-w-0 flex-1 space-y-1'>
          <p className='text-sm font-medium'>{item.name}</p>
          <Badge variant='secondary'>{t`Own product`}</Badge>
        </div>
        {user?.role === 'admin' ? (
          <div className='flex items-center gap-2'>
            <Input
              className='w-32'
              min={0}
              type='number'
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder={t`Unit price`}
            />
            <Button
              disabled={price === ''}
              loading={priceMutation.isPending}
              onClick={() => priceMutation.mutate()}
            >
              {t`Save`}
            </Button>
          </div>
        ) : (
          <p className='text-sm font-semibold'>
            {item.total_price === null
              ? t`Price will be set soon`
              : `${formatPrice(item.total_price)} ${t(CURRENCY_SYMBOL)}`}
          </p>
        )}
        <div>
          <p className='text-muted-foreground text-xs'>{t`Quantity`}</p>
          <p className='text-end text-sm font-semibold'>{item.quantity}</p>
        </div>
      </CardContent>
    </Card>
  );
};
