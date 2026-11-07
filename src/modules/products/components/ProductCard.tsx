import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import {
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  HeartIcon,
  ScaleIcon,
  StarIcon
} from 'lucide-react';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { CartButtons } from '@/modules/cart/components/CartButtons';
import { CURRENCY_SYMBOL, generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { useProductCompare } from '../hooks/useProductCompare';
import { useProductFavorite } from '../hooks/useProductFavorite';
import { ProductImageIndicators } from './ProductImageIndicators';

interface Props {
  className?: string;
  product: ProductPreview;
}

export const ProductCard = ({ product, className }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();
  const { isFavorite: isFav, onToggleFavorite } = useProductFavorite(product);
  const { isCompared, onToggleCompare } = useProductCompare(product);
  // Admins manage the catalog, they have no cart or favorites.
  const isAdmin = user?.role === 'admin';
  const productId = product.id;
  const variantsCount = product.variants_count;
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
                      decoding='async'
                      loading='lazy'
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <ProductImageIndicators images={images} />
            </Carousel>
          </Link>
          {!isAdmin && (
            <>
              <Button
                aria-label={isFav ? t`Remove from favorites` : t`Add to favorites`}
                className='absolute top-2 right-2 size-9 rounded-full bg-white/90 text-black shadow-sm backdrop-blur hover:bg-white'
                size='icon'
                variant='ghost'
                onClick={onToggleFavorite}
              >
                <HeartIcon className={cn('size-5', isFav && 'fill-red-500 text-red-500')} />
              </Button>
              <Button
                className={cn(
                  'absolute top-13 right-2 size-9 rounded-full text-black shadow-sm backdrop-blur',
                  isCompared ? 'bg-yellow-400 hover:bg-yellow-300' : 'bg-white/90 hover:bg-white'
                )}
                aria-label={isCompared ? t`Remove from comparison` : t`Add to comparison`}
                size='icon'
                variant='ghost'
                onClick={onToggleCompare}
              >
                <ScaleIcon className='size-5' />
              </Button>
            </>
          )}
        </div>
        <div className='min-w-0 flex-1'>
          <Link
            className='mt-2 line-clamp-3 text-base leading-6 font-semibold hover:underline lg:text-lg'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            {product.name}
          </Link>
          {variantsCount > 1 && (
            <p className='text-primary mt-1 text-sm font-medium'>{t`${variantsCount} variants`}</p>
          )}
          <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
            {product.stock_quantity > 0 ? (
              <span className='flex items-center gap-1 font-semibold text-green-600'>
                <CircleCheckIcon className='size-4' />
                {t`In stock`}
              </span>
            ) : (
              <span className='text-destructive flex items-center gap-1 font-semibold'>
                <CircleXIcon className='size-4' />
                {t`Out of stock`}
              </span>
            )}
            {Number(product.average_rating) > 0 && (
              <span className='flex items-center gap-1 font-medium'>
                <StarIcon className='size-4 fill-yellow-400 text-yellow-400' />
                {product.average_rating}
              </span>
            )}
          </div>
          <p className='text-muted-foreground mt-2 flex flex-wrap items-center gap-x-1 text-sm'>
            {product.category_path.map((name, index) => (
              <span key={name} className='flex items-center gap-1'>
                {index > 0 && <ChevronRightIcon className='size-3.5' />}
                {name}
              </span>
            ))}
          </p>
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
                {formatPrice(product.price)} {t(CURRENCY_SYMBOL)}
              </p>
            )}
            <p className='text-xl leading-tight font-extrabold whitespace-nowrap lg:text-2xl'>
              {formatPrice(product.final_price)} {t(CURRENCY_SYMBOL)}
            </p>
            {product.unit && (
              <p className='text-muted-foreground mt-1 text-xs capitalize'>/ {product.unit.unit}</p>
            )}
          </div>
          {!isAdmin && (
            <div className='sm:mt-3'>
              <CartButtons product={product} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
