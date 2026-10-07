import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Trash2Icon } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { currencySymbolMap } from '@/modules/currency';
import { generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

import { useCartItem } from '../hooks/useCartItem';
import { CartCounter } from './CartCounter';

interface Props {
  item: CartItem;
}

export const CartItemRow = ({ item }: Props) => {
  const { t } = useLingui();

  const { user } = useAuth();

  const { state, functions } = useCartItem(
    item.product.company,
    item.variant,
    item.attribute_stock
      ? {
          type: 'ready',
          attributeStock: item.attribute_stock
        }
      : {
          type: 'rfq',
          deadline: item.deadline!,
          attributes:
            item.attributes?.map((item) => ({
              ...item,
              value_option: item.value_option?.id
            })) ?? []
        }
  );

  const image =
    item.variant.medias?.find((m) => m.product_media_type === 'photo')?.file ?? item.product.image;

  const slug = generateSlugId(item.product.id, item.product.name);
  const unitPrice = item.variant.price_override;

  return (
    <Card size='sm'>
      <CardContent className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
        <Link className='shrink-0 self-start' params={{ slug }} to='/product/$slug'>
          <img
            alt={item.product.name}
            className='ring-foreground/10 size-16 rounded-lg object-contain ring-1 sm:size-20'
            src={image}
          />
        </Link>

        <div className='flex min-w-0 flex-1 flex-col space-y-2'>
          <div className='space-y-2'>
            <Link
              className='line-clamp-2 text-sm font-medium hover:underline'
              params={{ slug }}
              to='/product/$slug'
            >
              {item.product.name}
            </Link>
            <p className='text-muted-foreground text-xs'>SKU: {item.variant.sku_variant}</p>
            <div className='flex flex-wrap items-center gap-2'>
              {item.attribute_stock?.attribute_values.map((attr) => (
                <Badge key={attr.id} variant='secondary'>
                  {attr.value}
                </Badge>
              ))}
              {item.attributes?.map((attr) => (
                <Badge key={attr.attribute} variant='secondary'>
                  {attr.value_option?.value ?? attr.value}
                </Badge>
              ))}
            </div>
            <div>
              {item.attribute_stock ? (
                <Badge>{t`Ready`}</Badge>
              ) : (
                <span className='text-muted-foreground text-xs'>
                  <Badge>{t`RFQ`}</Badge> {t`Deadline`}:{' '}
                  {format(item.deadline ?? new Date(), 'dd.MM.yyyy')}
                </span>
              )}
            </div>
          </div>

          <div className='flex items-center justify-between gap-2 pt-1'>
            <div className='flex items-center gap-1'>
              <p className='text-sm font-semibold'>
                {formatPrice(item.total_price)}{' '}
                {user?.currency && currencySymbolMap[user?.currency]}
              </p>
              {state.cartCount > 1 && (
                <>
                  <span className='text-muted-foreground'>/</span>
                  <p className='text-muted-foreground text-xs'>
                    {formatPrice(unitPrice)} {user?.currency && currencySymbolMap[user?.currency]}{' '}
                    {t`unit`}
                  </p>
                </>
              )}
            </div>

            <div className='flex items-center gap-2 sm:hidden'>
              <CartCounter
                maxValue={item.attribute_stock ? item.attribute_stock.quantity : 1_000_000}
                value={state.cartCount}
                onChange={functions.onCartCountChange}
              />
              <Button size='sm' variant='destructiveGhost' onClick={functions.onRemoveFromCart}>
                <Trash2Icon className='size-4' />
              </Button>
            </div>
          </div>
        </div>

        <div className='hidden max-w-32 flex-col items-end justify-between sm:flex'>
          <CartCounter
            maxValue={item.attribute_stock ? item.attribute_stock.quantity : 1_000_000}
            value={state.cartCount}
            onChange={functions.onCartCountChange}
          />
          <Button size='sm' variant='destructiveGhost' onClick={functions.onRemoveFromCart}>
            <Trash2Icon className='size-4' />
            {t`Delete`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
