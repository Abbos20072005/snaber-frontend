import { useLingui } from '@lingui/react/macro';
import {
  CircleCheckIcon,
  CircleXIcon,
  CreditCardIcon,
  HeartIcon,
  Share2Icon,
  TruckIcon
} from 'lucide-react';
import { toast } from 'sonner';

import { CartButtons } from '@/modules/cart/components/CartButtons';
import { useProductFavorite } from '@/modules/products/hooks/useProductFavorite';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface Props {
  product: PublicProduct;
}

export const PublicProductAside = ({ product }: Props) => {
  const { t } = useLingui();
  const { isFavorite, onToggleFavorite } = useProductFavorite({
    ...product,
    category: product.category.id
  });

  const isInStock = product.stock_quantity > 0;

  const onShare = () => {
    void navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success(t`Link copied`));
  };

  const infoBlocks = [
    {
      icon: TruckIcon,
      title: t`Delivery`,
      description: t`Delivery terms are agreed when the order is confirmed.`
    },
    {
      icon: CreditCardIcon,
      title: t`Payment`,
      description: t`Payment terms are agreed when the order is confirmed.`
    }
  ];

  return (
    <aside>
      <Card className='rounded-2xl py-0'>
        <CardContent className='space-y-4 p-6'>
          <div>
            {product.discount_percent > 0 && (
              <div className='mb-1 flex items-center gap-2'>
                <span className='text-muted-foreground text-sm line-through'>
                  {formatPrice(product.price)} {CURRENCY_SYMBOL}
                </span>
                <Badge variant='destructive'>-{product.discount_percent}%</Badge>
              </div>
            )}
            <p className='text-3xl font-extrabold'>
              {formatPrice(product.final_price)} {CURRENCY_SYMBOL}
              {product.unit && (
                <span className='text-muted-foreground ml-1.5 text-base font-normal'>
                  / {product.unit.unit}
                </span>
              )}
            </p>
          </div>

          <p
            className={cn(
              'flex items-center gap-2 text-sm font-medium',
              isInStock ? 'text-success' : 'text-muted-foreground'
            )}
          >
            {isInStock ? (
              <CircleCheckIcon className='size-5' />
            ) : (
              <CircleXIcon className='size-5' />
            )}
            {isInStock ? `${t`In stock`}: ${formatPrice(product.stock_quantity)}` : t`Out of stock`}
          </p>

          <CartButtons product={product} />

          <div className='grid grid-cols-2 gap-2'>
            <Button type='button' variant='outline' onClick={onToggleFavorite}>
              <HeartIcon className={cn(isFavorite && 'fill-red-500 text-red-500')} />
              {t`Favorites`}
            </Button>
            <Button type='button' variant='outline' onClick={onShare}>
              <Share2Icon />
              {t`Share`}
            </Button>
          </div>

          <div className='space-y-4 border-t pt-4'>
            {infoBlocks.map(({ icon: Icon, title, description }) => (
              <div key={title} className='flex gap-3'>
                <Icon className='text-primary mt-0.5 size-5 shrink-0' />
                <div>
                  <p className='text-sm font-semibold'>{title}</p>
                  <p className='text-muted-foreground text-sm'>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};
