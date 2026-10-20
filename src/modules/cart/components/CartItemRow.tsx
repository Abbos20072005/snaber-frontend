import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';

import { CURRENCY_SYMBOL, generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

import { useCartItem } from '../hooks/useCartItem';
import { CartCounter } from './CartCounter';

interface Props {
  item: CartItem;
}

export const CartItemRow = ({ item }: Props) => {
  const { t } = useLingui();

  const { state, functions } = useCartItem(item.product);

  const slug = generateSlugId(item.product.id, item.product.name);
  const unitPrice = item.product.final_price;

  return (
    <Card size='sm'>
      <CardContent className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
        <Link className='shrink-0 self-start' params={{ slug }} to='/product/$slug'>
          <img
            alt={item.product.name}
            className='ring-foreground/10 size-16 rounded-lg object-contain ring-1 sm:size-20'
            src={item.product.image ?? undefined}
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
            {item.product.sku && (
              <p className='text-muted-foreground text-xs'>SKU: {item.product.sku}</p>
            )}
          </div>

          <div className='flex items-center justify-between gap-2 pt-1'>
            <div className='flex items-center gap-1'>
              <p className='text-sm font-semibold'>
                {formatPrice(item.total_price)} {CURRENCY_SYMBOL}
              </p>
              {state.cartCount > 1 && (
                <>
                  <span className='text-muted-foreground'>/</span>
                  <p className='text-muted-foreground text-xs'>
                    {formatPrice(unitPrice)} {CURRENCY_SYMBOL} {t`unit`}
                  </p>
                </>
              )}
            </div>

            <div className='flex items-center gap-2 sm:hidden'>
              <CartCounter
                maxValue={item.product.stock_quantity}
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
            maxValue={item.product.stock_quantity}
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
