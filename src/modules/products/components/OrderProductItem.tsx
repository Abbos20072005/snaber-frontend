import type { ComponentProps } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';

import { useAuthed } from '@/modules/auth';
import { currencySymbolMap } from '@/modules/currency';
import { generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

type Props = ComponentProps<'div'> & {
  item: Order['items'][number];
  company: ProductCompany;
};

export const OrderProductItem = ({ item }: Props) => {
  const { t } = useLingui();

  const image =
    item.variant.medias?.find((m) => m.product_media_type === 'photo')?.file ??
    item.product.image ??
    '';

  const slug = generateSlugId(item.product.product_id ?? item.product.id, item.product.name);
  const unitPrice = item.variant.price_override;

  const { user } = useAuthed();

  return (
    <Card size='sm'>
      <CardContent className='flex gap-4'>
        <Link className='shrink-0' params={{ slug }} to='/product/$slug'>
          <img
            alt={item.product.name}
            className='ring-foreground/10 size-20 rounded-lg object-contain ring-1'
            src={image}
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
            <p className='text-muted-foreground text-xs'>SKU: {item.variant.sku_variant}</p>
            <div className='flex flex-wrap items-center gap-2'>
              {item.attribute_stock?.attribute_values.map((item) => (
                <Badge key={item.id} variant='secondary'>
                  {item.value}
                </Badge>
              ))}
              {item.attributes?.map((item) => (
                <Badge key={item.attribute} variant='secondary'>
                  {item.value_option?.value ?? item.value}
                </Badge>
              ))}
            </div>
            <div className='mt-2'>
              {item.attribute_stock ? (
                <Badge>{t`Ready`}</Badge>
              ) : (
                <>
                  <Badge>{t`RFQ`}</Badge> {t`Deadline`}:{' '}
                  {format(item.deadline ?? new Date(), 'dd.MM.yyyy')}
                </>
              )}
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <p className='text-sm font-semibold'>
              {formatPrice(item.total_price)} {user.currency && currencySymbolMap[user.currency]}
            </p>
            {item.quantity > 1 && (
              <>
                <span>/</span>
                <p className='text-muted-foreground text-xs'>
                  {formatPrice(unitPrice)} {user.currency && currencySymbolMap[user.currency]}{' '}
                  {t`unit`}
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
