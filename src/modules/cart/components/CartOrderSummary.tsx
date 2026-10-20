import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBagIcon } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { PRODUCT_QUERY_KEYS } from '@/modules/products';
import { postCartCheckout } from '@/shared/api/requests/product/cart';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { useAuthContext } from '@/shared/context';
import { formatPrice } from '@/shared/lib/format.ts';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface Props {
  cart: FullCart;
}

export const CartOrderSummary = ({ cart }: Props) => {
  const { user } = useAuth();
  const { setIsOpen } = useAuthContext();
  const { t } = useLingui();
  const navigate = useNavigate();

  const checkoutMutation = useMutation({
    mutationFn: () => postCartCheckout().then(({ data }) => data),
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getCartList()
    },
    onSuccess: (data) =>
      void navigate({ to: '/profile/orders/$id', params: { id: String(data.id) } })
  });

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const onSubmit = () => {
    if (user) {
      checkoutMutation.mutate();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Card className='lg:sticky lg:top-20'>
      <CardContent className='space-y-4'>
        <p className='text-base font-semibold'>{t`Order Summary`}</p>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{t`Products`}</span>
            <span>{cart.items.length}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>{t`Units`}</span>
            <span>{totalItems}</span>
          </div>
        </div>

        <div className='flex justify-between border-t pt-3 text-base font-bold'>
          <span>{t`Total`}</span>
          <span>
            {formatPrice(cart.total_amount)} {CURRENCY_SYMBOL}
          </span>
        </div>

        <Button
          className='w-full gap-2'
          disabled={checkoutMutation.isPending}
          size='lg'
          loading={checkoutMutation.isPending}
          onClick={onSubmit}
        >
          <ShoppingBagIcon className='size-5' />
          {t`Create order`}
        </Button>
      </CardContent>
    </Card>
  );
};
