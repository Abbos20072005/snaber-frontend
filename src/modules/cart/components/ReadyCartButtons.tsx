import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';
import { Button, buttonVariants } from 'src/shared/ui/button.tsx';

import { cn } from '@/shared/lib/utils.ts';

import { useCartItem } from '../hooks/useCartItem.ts';
import { CartCounter } from './CartCounter.tsx';

interface Props {
  company: ProductCompany;
  productVariant: ProductVariant;
  stock: ProductVariantAttributeStock;
}

export const ReadyCartButtons = ({ company, productVariant, stock }: Props) => {
  const { t } = useLingui();
  const { state, functions } = useCartItem(company, productVariant, {
    type: 'ready',
    attributeStock: stock
  });

  if (state.cartCount === 0)
    return (
      <Button className='w-full' disabled={stock.quantity === 0} onClick={functions.onAddToCart}>
        {stock.quantity === 0 ? t`Out of stock` : t`Add to cart`}
      </Button>
    );

  return (
    <div className='grid grid-cols-2 gap-2'>
      <CartCounter
        className='w-full'
        maxValue={stock.quantity}
        value={state.cartCount}
        onChange={functions.onCartCountChange}
      />
      <Link
        className={cn(buttonVariants({ variant: 'outline' }))}
        search={{ company: company.id }}
        to='/cart'
      >
        <ShoppingCartIcon />
        {t`To cart`}
      </Link>
    </div>
  );
};
