import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuthed } from '@/modules/auth';
import { ORDER_QUERY_KEYS, orderStatusColorMap, orderStatusLabelMap } from '@/modules/order';
import { patchOrder } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

const orderStatuses: OrderStatus[] = ['negotiation', 'accepted', 'rejected'];

interface Props {
  order?: Order | null;
}

export const OrderStatusDropdown = ({ order }: Props) => {
  const { t } = useLingui();
  const { user } = useAuthed();
  const queryClient = useQueryClient();
  const canChangeStatus = order?.status === 'negotiation' && user.role === 'seller';
  const [confirmClose, setConfirmClose] = useState<boolean>(false);

  const patchOrderMutation = useMutation({
    mutationFn: patchOrder,
    onSuccess: () => {
      toast.success(t`Order status updated.`);
      void queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.base() });
      setConfirmClose(false);
    }
  });

  const handleStatusChange = (status: OrderStatus) => {
    if (!order || !canChangeStatus || order.status === status || patchOrderMutation.isPending)
      return;

    patchOrderMutation.mutate({
      id: order.id,
      data: {
        status
      }
    });
  };

  if (!order) return null;

  const acceptedBySeller = order.accepted_by_seller;
  const rejectedBySeller = order.rejected_by_seller;
  const shouldDisabledDropdown = acceptedBySeller || rejectedBySeller;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              disabled={
                !canChangeStatus ||
                patchOrderMutation.isPending ||
                shouldDisabledDropdown ||
                order.is_closed
              }
              className='h-9 gap-2'
              size='sm'
              type='button'
              variant='outline'
            >
              <span
                className='size-2 rounded-full'
                style={{ backgroundColor: orderStatusColorMap[order.status] }}
              />
              {t(orderStatusLabelMap[order.status])}
              <ChevronDownIcon className='size-4' />
            </Button>
          }
          disabled={!canChangeStatus || patchOrderMutation.isPending}
        />
        <DropdownMenuContent align='end' className='w-44'>
          {orderStatuses.map((status) => (
            <DropdownMenuItem
              key={status}
              disabled={!canChangeStatus || patchOrderMutation.isPending || status === order.status}
              onClick={() => handleStatusChange(status)}
            >
              <span
                className='size-2 rounded-full'
                style={{ backgroundColor: orderStatusColorMap[status] }}
              />
              {t(orderStatusLabelMap[status])}
              {status === order.status ? <CheckIcon className='ml-auto size-4' /> : null}
            </DropdownMenuItem>
          ))}
          {!order.is_closed && (
            <DropdownMenuItem variant='destructive' onClick={() => setConfirmClose(true)}>
              <span
                className='size-2 rounded-full'
                style={{ backgroundColor: orderStatusColorMap.rejected }}
              />
              {t`Close`}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        cancelLabel={t`No, keep it`}
        title={t`Close order`}
        confirmLabel={t`Yes, close it`}
        confirmVariant='destructive'
        description={t`Are you sure you want to close this order? This action cannot be undone.`}
        onConfirm={() => {
          if (!order) return;
          patchOrderMutation.mutate({
            id: order.id,
            data: {
              is_closed: true
            }
          });
        }}
        onOpenChange={setConfirmClose}
        open={confirmClose}
      />
    </>
  );
};
