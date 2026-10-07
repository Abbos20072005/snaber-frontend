import { useLingui } from '@lingui/react/macro';

import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

interface Props {
  isActive: boolean;
  order: Order;
  onSelect: (orderId: number) => void;
}

export const OrderListItem = ({ isActive, order, onSelect }: Props) => {
  const { t } = useLingui();
  const calculatedQuantity = order.items.reduce((total, item) => total + item.quantity, 0);
  const calculatedTotalPrice = order.items.reduce(
    (total, item) => total + Number(item.total_price || 0),
    0
  );
  const quantity = order.quantity || calculatedQuantity;
  const totalPrice = order.total_price || calculatedTotalPrice;

  return (
    <button
      className={cn(
        'hover:bg-muted/60 flex w-full flex-col gap-3 rounded-md border p-3 text-left transition-colors',
        isActive && 'border-primary bg-primary/5 ring-primary/20 ring-2'
      )}
      type='button'
      onClick={() => onSelect(order.id)}
    >
      <div className='space-y-1'>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-sm font-semibold'>#{order.id}</p>
          <p className='text-muted-foreground shrink-0 text-end text-xs'>
            {formatLocaleDate(order.created_at, 'PP HH:mm')}
          </p>
        </div>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-primary truncate text-xs font-medium'>{order.buyer.full_name}</p>
          <p className='truncate text-end text-xs font-bold'>{order.buyer.country}</p>
        </div>
      </div>
      <div className='text-muted-foreground grid grid-cols-2 gap-2 border-t pt-3 text-xs'>
        <div>
          <span className='block'>{t`Quantity`}</span>
          <span className='text-foreground font-medium'>{formatPrice(quantity)}</span>
        </div>
        <div className='text-right'>
          <span className='block'>{t`Total`}</span>
          <span className='text-foreground font-medium'>{formatPrice(totalPrice)} UZS</span>
        </div>
      </div>
    </button>
  );
};
