import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronRightIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react';
import { toast } from 'sonner';

import { postCart } from '@/shared/api/requests/product/cart';
import { CURRENCY_SYMBOL, generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { useProductFavorite } from '../hooks/useProductFavorite';
import { PRODUCT_QUERY_KEYS } from '../options';
import { ProductImageIndicators } from './ProductImageIndicators';

interface Props {
  className?: string;
  product: ProductPreview;
}

export const ProductCard = ({ product, className }: Props) => {
  const { t } = useLingui();
  const { isFavorite: isFav, onToggleFavorite } = useProductFavorite(product);
  const productId = product.id;
  const images = product.images;

  // Products without filled-in characteristics still show the basics instead of an empty card.
  const specifications =
    product.specifications.length > 0
      ? product.specifications
      : [
          ...(product.sku ? [{ name: t`Code`, value: product.sku }] : []),
          {
            name: t`In stock`,
            value:
              product.stock_quantity > 0
                ? `${formatPrice(product.stock_quantity)} ${product.unit?.unit ?? ''}`.trim()
                : t`Out of stock`
          }
        ];

  const addToCartMutation = useMutation({
    mutationFn: () => postCart({ data: { product: productId, quantity: 1 } }),
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getCartList()
    },
    onSuccess: () => toast.success(t`Added to cart`),
    onError: () => toast.error(t`Failed to add the product to the cart`)
  });

  return (
    <Card className={cn('p-3 sm:p-5', className)} size='sm'>
      <div className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
        <div className='relative mx-auto w-full max-w-55 shrink-0 sm:mx-0 sm:w-48 lg:w-56'>
          <Link
            className='block'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            <Carousel className='w-full' data-product-image-carousel>
              <CarouselContent>
                {images.map((image) => (
                  <CarouselItem key={image}>
                    <img
                      alt={t`Product image`}
                      className='aspect-square w-full rounded-lg border object-cover'
                      src={image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <ProductImageIndicators images={images} />
            </Carousel>
          </Link>
          <Button
            aria-label={isFav ? t`Remove from favorites` : t`Add to favorites`}
            className='absolute top-2 right-2 size-9 rounded-full bg-white/90 text-black shadow-sm backdrop-blur hover:bg-white'
            size='icon'
            variant='ghost'
            onClick={onToggleFavorite}
          >
            <HeartIcon className={cn('size-5', isFav && 'fill-red-500 text-red-500')} />
          </Button>
        </div>
        <div className='min-w-0 flex-1'>
          <Link
            className='mt-2 line-clamp-3 text-base leading-6 font-semibold hover:underline lg:text-lg'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            {product.name}
          </Link>
          <dl className='mt-3 space-y-1.5'>
            {specifications.map((spec) => (
              <div key={`${spec.name}-${spec.value}`} className='flex gap-1 text-sm leading-6'>
                <dt className='text-muted-foreground shrink-0'>{spec.name}:</dt>
                <dd className='min-w-0 truncate font-medium'>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            className='text-primary mt-3 inline-flex items-center gap-1 text-sm font-semibold hover:underline'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            {t`Show all characteristics`}
            <ChevronRightIcon className='size-4' />
          </Link>
        </div>
        <div className='flex shrink-0 flex-row items-center justify-between gap-3 border-t pt-3 sm:w-52 sm:flex-col sm:items-stretch sm:justify-start sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 lg:w-60'>
          <div>
            {product.discount_percent > 0 && (
              <p className='text-muted-foreground text-xs whitespace-nowrap line-through'>
                {formatPrice(product.price)} {CURRENCY_SYMBOL}
              </p>
            )}
            <p className='text-xl leading-tight font-extrabold whitespace-nowrap lg:text-2xl'>
              {formatPrice(product.final_price)} {CURRENCY_SYMBOL}
            </p>
            {product.unit && (
              <p className='text-muted-foreground mt-1 text-xs capitalize'>/ {product.unit.unit}</p>
            )}
          </div>
          <Button
            className='shrink-0 bg-yellow-400 font-bold text-black hover:bg-yellow-300 sm:mt-3 sm:w-full'
            disabled={addToCartMutation.isPending || product.stock_quantity === 0}
            variant='secondary'
            loading={addToCartMutation.isPending}
            onClick={() => addToCartMutation.mutate()}
          >
            <ShoppingCartIcon />
            {product.stock_quantity === 0 ? t`Out of stock` : t`Add to cart`}
          </Button>
        </div>
      </div>
    </Card>
  );
};
