import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { CartCounter } from '@/modules/cart/components/CartCounter';
import { useCartItem } from '@/modules/cart/hooks/useCartItem';
import { CURRENCY_SYMBOL, generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

interface Props {
  product: PublicProduct;
}

const VariantCartCell = ({ variant }: { variant: FamilyVariant }) => {
  const { t } = useLingui();
  const { state, functions } = useCartItem(variant);

  if (variant.stock_quantity === 0)
    return <span className='text-muted-foreground text-xs'>{t`Out of stock`}</span>;

  if (state.cartCount === 0)
    return (
      <Button size='sm' variant='outline' onClick={functions.onAddToCart}>
        <ShoppingCartIcon />
        {t`Add to cart`}
      </Button>
    );

  return (
    <CartCounter
      className='ml-auto w-32'
      maxValue={variant.stock_quantity}
      value={state.cartCount}
      onChange={functions.onCartCountChange}
    />
  );
};

// Sibling products of the same family (e.g. one bearing type in many sizes), each one with its
// own code, price and stock, so a shopper can compare them and order several at once.
export const PublicProductVariants = ({ product }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();
  const family = product.family;

  if (!family || family.variants.length < 2) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <section className='space-y-3'>
      <h2 className='text-xl font-bold'>
        {t`All variants`} ({family.variants.length})
      </h2>
      <div className='bg-card overflow-hidden rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead>{t`Product`}</TableHead>
              {family.axes.map((axis) => (
                <TableHead key={axis.id}>{axis.name}</TableHead>
              ))}
              <TableHead>{t`Code`}</TableHead>
              <TableHead className='text-right'>{t`Price`}</TableHead>
              <TableHead className='text-right'>{t`In stock`}</TableHead>
              {!isAdmin && <TableHead className='w-44' />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {family.variants.map((variant) => {
              const isCurrent = variant.id === product.id;

              return (
                <TableRow key={variant.id} className={cn(isCurrent && 'bg-yellow-50')}>
                  <TableCell className='font-medium'>
                    {isCurrent ? (
                      variant.name
                    ) : (
                      <Link
                        className='hover:underline'
                        params={{ slug: generateSlugId(variant.id, variant.name) }}
                        to='/product/$slug'
                      >
                        {variant.name}
                      </Link>
                    )}
                  </TableCell>
                  {family.axes.map((axis) => (
                    <TableCell key={axis.id} className='text-muted-foreground'>
                      {variant.options.find((option) => option.attribute === axis.id)?.value ?? '—'}
                    </TableCell>
                  ))}
                  <TableCell className='font-mono text-xs'>{variant.sku}</TableCell>
                  <TableCell className='text-right font-semibold whitespace-nowrap'>
                    {formatPrice(variant.final_price)} {CURRENCY_SYMBOL}
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatPrice(variant.stock_quantity)} {variant.unit?.unit}
                  </TableCell>
                  {!isAdmin && (
                    <TableCell className='text-right'>
                      <VariantCartCell variant={variant} />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
