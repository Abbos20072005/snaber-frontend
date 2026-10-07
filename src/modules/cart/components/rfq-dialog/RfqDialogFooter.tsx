import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';

import { CartCounter } from '@/modules/cart';
import { cn } from '@/shared/lib/utils.ts';
import { Button, buttonVariants } from '@/shared/ui/button.tsx';
import { DialogFooter } from '@/shared/ui/dialog.tsx';

interface RfqDialogFooterProps {
  cartCount: number;
  companyId: number;
  isValid: boolean;
  onAddToCart: () => void;
  onCartCountChange: (value: number) => void;
}

export const RfqDialogFooter = ({
  cartCount,
  companyId,
  isValid,
  onAddToCart,
  onCartCountChange
}: RfqDialogFooterProps) => {
  const { t } = useLingui();

  return (
    <DialogFooter>
      {cartCount === 0 ? (
        <Button className='w-full' disabled={!isValid} onClick={onAddToCart}>
          {t`Add to cart`}
        </Button>
      ) : (
        <div className='grid grid-cols-2 gap-2'>
          <CartCounter
            className='w-full'
            disabled={!isValid}
            maxValue={1_000_000}
            value={cartCount}
            onChange={onCartCountChange}
          />
          <Link
            className={cn('w-full', buttonVariants({ variant: 'outline' }))}
            search={{ company: companyId }}
            to='/cart'
          >
            <ShoppingCartIcon />
            {t`To cart`}
          </Link>
        </div>
      )}
    </DialogFooter>
  );
};
