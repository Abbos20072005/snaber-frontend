import type { ComponentProps } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';

import { CURRENCY_SYMBOL, generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent } from '@/shared/ui/card';

type Props = ComponentProps<'div'> & {
  item: Order['items'][number];
};

export const OrderProductItem = ({ item }: Props) => {
  const { t } = useLingui();

  const slug = generateSlugId(item.product.id, item.product.name);

  return (
    <Card size='sm'>
      <CardContent className='flex gap-4'>
        <Link className='shrink-0' params={{ slug }} to='/product/$slug'>
          <img
            alt={item.product.name}
            className='ring-foreground/10 size-20 rounded-lg object-contain ring-1'
            src={item.product.image ?? undefined}
          />
        </Link>

        <div className='flex min-w-0 flex-1 flex-col justify-between space-y-3'>
          <div className='space-y-1'>
            <Link
              className='line-clamp-2 text-sm font-medium hover:underline'
              params={{ slug }}
              to='/product/$slug'
            >
              {item.product.name}
            </Link>
            {item.product.sku && (
              <p className='text-muted-foreground text-xs'>SKU: {item.product.sku}</p>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <p className='text-sm font-semibold'>
              {formatPrice(item.total_price)} {CURRENCY_SYMBOL}
            </p>
            {item.quantity > 1 && (
              <>
                <span>/</span>
                <p className='text-muted-foreground text-xs'>
                  {formatPrice(item.price)} {CURRENCY_SYMBOL} {t`unit`}
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <p className='text-muted-foreground text-xs'>{t`Quantity`}</p>
          <p className='text-end text-sm font-semibold'>{item.quantity}</p>
        </div>
      </CardContent>
    </Card>
  );
};
