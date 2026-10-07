import { useLingui } from '@lingui/react/macro';
import { XIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export const ProductRequestItem = ({
  product
}: {
  product: {
    id: number;
    image: string;
    name: string;
    quantity: number;
    sku: string;
  };
}) => {
  const { t } = useLingui();

  return (
    <article className='bg-background flex items-center gap-3 rounded-lg border p-2 shadow-xs'>
      <img
        alt={product.name}
        className='size-11 shrink-0 rounded-md border object-cover'
        src={product.image}
      />

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold'>{product.name}</p>
        <p className='text-muted-foreground mt-0.5 truncate text-xs'>{product.sku}</p>
      </div>

      <label className='text-muted-foreground flex shrink-0 items-center gap-2 text-xs'>
        {t`Qty:`}
        <Input
          readOnly
          aria-label={t`Quantity`}
          className='bg-muted/20 h-8 w-20 text-center text-sm font-semibold'
          value={product.quantity}
        />
      </label>

      <Button aria-label={t`Remove product`} size='icon-xs' type='button' variant='ghost'>
        <XIcon className='text-muted-foreground size-4' />
      </Button>
    </article>
  );
};
