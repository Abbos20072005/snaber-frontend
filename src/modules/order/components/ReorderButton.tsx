import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { RotateCcwIcon } from 'lucide-react';
import { toast } from 'sonner';

import { PRODUCT_QUERY_KEYS } from '@/modules/products';
import { postOrderReorder } from '@/shared/api';
import { Button } from '@/shared/ui/button';

interface Props {
  orderId: number;
}

// Puts the products of a past order back into the cart, then the user trims it and checks out.
export const ReorderButton = ({ orderId }: Props) => {
  const { t } = useLingui();
  const navigate = useNavigate();

  const reorderMutation = useMutation({
    mutationFn: postOrderReorder,
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getCartList()
    },
    onSuccess: () => {
      toast.success(t`Products added to the cart`);
      void navigate({ to: '/cart' });
    }
  });

  const onReorder = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The button sits inside the order link on the list page.
    event.preventDefault();
    event.stopPropagation();
    reorderMutation.mutate({ id: orderId });
  };

  return (
    <Button
      disabled={reorderMutation.isPending}
      size='sm'
      type='button'
      variant='outline'
      loading={reorderMutation.isPending}
      onClick={onReorder}
    >
      <RotateCcwIcon />
      {t`Reorder`}
    </Button>
  );
};
