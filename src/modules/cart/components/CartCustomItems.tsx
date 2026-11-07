import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import { Button, buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

interface Props {
  items: CartCustomItem[];
  onChange: (items: CartCustomItem[]) => void;
}

// Products that are not in the catalog: the buyer writes them and they go into the order unpriced.
export const CartCustomItems = ({ items, onChange }: Props) => {
  const { t } = useLingui();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const onAdd = () => {
    if (!name.trim()) return;
    onChange([...items, { name: name.trim(), quantity }]);
    setName('');
    setQuantity(1);
  };

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{t`Cannot find a product?`}</CardTitle>
        <CardDescription>
          {t`Add it to this order. We will find it and set the price. Or send a separate request.`}
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className='flex items-center gap-2 text-sm'>
            <span className='flex-1 font-medium'>{item.name}</span>
            <span className='text-muted-foreground'>× {item.quantity}</span>
            <Button
              aria-label={t`Delete`}
              size='icon'
              variant='ghost'
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
        <div className='flex flex-wrap gap-2'>
          <Input
            className='min-w-40 flex-1'
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t`Product name`}
          />
          <Input
            className='w-24'
            min={1}
            type='number'
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, +event.target.value || 1))}
          />
          <Button type='button' variant='outline' onClick={onAdd}>
            <PlusIcon />
            {t`Add to order`}
          </Button>
        </div>
        <Link className={buttonVariants({ variant: 'link' })} to='/quick-order'>
          {t`Send a request instead`}
        </Link>
      </CardContent>
    </Card>
  );
};
