import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ChevronRightIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react';
import { toast } from 'sonner';

import { currencySymbolMap } from '@/modules/currency';
import { getPublicProductById, postFavouriteProduct } from '@/shared/api';
import { postCart } from '@/shared/api/requests/product/cart';
import { generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { useFavoritesStore } from '@/shared/store';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { productTypeColorMap, productTypeLabelMap } from '../constants';
import { PRODUCT_QUERY_KEYS } from '../options';
import { ProductImageIndicators } from './ProductImageIndicators';

interface Props {
  className?: string;
  isShowCompany?: boolean;
  product: ProductPreview;
}

export const ProductCard = ({ product, isShowCompany = true, className }: Props) => {
  const { t } = useLingui();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const productId = product.product_id ?? product.id;
  const images = product.images ?? [];

  const isFav = isFavorite(productId);

  const postFavoriteMutation = useMutation({
    mutationFn: postFavouriteProduct,
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getFavorites()
    }
  });

  const onToggleFavorite = () => {
    const wasFavorite = isFav;

    toggleFavorite(product);

    if (!wasFavorite) toast(t`Added to favorites`);
    postFavoriteMutation.mutate(
      { data: { product_id: productId, is_favourite: !wasFavorite } },
      { onError: () => toggleFavorite(product) }
    );
  };

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const { data: detail } = await getPublicProductById({ id: productId });
      const variant = detail.variants[0];

      if (!variant) throw new Error(t`Product variant not found`);

      await postCart({
        data: {
          product: variant.id,
          quantity: 1,
          attribute_stock: variant.attribute_stocks[0]?.id
        }
      });
    },
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
          <div className='flex flex-wrap gap-1'>
            {product.product_type === 'both' ? (
              <>
                <Badge
                  style={{
                    backgroundColor: productTypeColorMap.ready
                  }}
                >
                  {t(productTypeLabelMap.ready)}
                </Badge>
                <Badge
                  style={{
                    backgroundColor: productTypeColorMap.made_to_order
                  }}
                >
                  {t(productTypeLabelMap.made_to_order)}
                </Badge>
              </>
            ) : (
              <Badge
                style={{
                  backgroundColor: productTypeColorMap[product.product_type]
                }}
              >
                {t(productTypeLabelMap[product.product_type])}
              </Badge>
            )}
          </div>
          <Link
            className='mt-2 line-clamp-3 text-base leading-6 font-semibold hover:underline lg:text-lg'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            {product.name}
          </Link>
          {isShowCompany && (
            /* FEATURE DISABLED: Company mini-site link. */
            // <Link
            //   className='text-success text-xs hover:underline'
            //   params={{ slug: generateSlugId(product.company.id, product.company.name) }}
            //   to='/companies/$slug'
            // >
            //   {product.company.name}
            // </Link>
            <p className='text-success mt-1 truncate text-sm'>{product.company.name}</p>
          )}
          {(product.specifications ?? []).length > 0 && (
            <dl className='mt-3 space-y-1.5'>
              {(product.specifications ?? []).slice(0, 6).map((spec) => (
                <div key={`${spec.name}-${spec.value}`} className='flex gap-1 text-sm leading-6'>
                  <dt className='text-muted-foreground shrink-0'>{spec.name}:</dt>
                  <dd className='min-w-0 truncate font-medium'>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
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
            <p className='text-xl leading-tight font-extrabold whitespace-nowrap lg:text-2xl'>
              {formatPrice(product.price_min)}
              {currencySymbolMap[product.currency]}
            </p>
            <p className='text-muted-foreground mt-1 text-xs capitalize'>
              / {product.moq_unit.unit}
            </p>
          </div>
          <Button
            className='shrink-0 bg-yellow-400 font-bold text-black hover:bg-yellow-300 sm:mt-3 sm:w-full'
            disabled={addToCartMutation.isPending}
            variant='secondary'
            loading={addToCartMutation.isPending}
            onClick={() => addToCartMutation.mutate()}
          >
            <ShoppingCartIcon />
            {t`Add to cart`}
          </Button>
        </div>
      </div>
      {/* FEATURE DISABLED: Min order / lead time info. */}
      {/* <div className='flex justify-between gap-2'> */}
      {/*   <div> */}
      {/*     <p className='text-muted-foreground text-xs font-semibold'>{t`Min. order`}</p> */}
      {/*     <p className='text-sm font-medium'> */}
      {/*       {product.moq} {product.moq_unit.unit} */}
      {/*     </p> */}
      {/*   </div> */}
      {/*   <div> */}
      {/*     <p className='text-muted-foreground text-xs font-semibold'>{t`Lead time`}</p> */}
      {/*     <p className='text-sm font-medium'> */}
      {/*       {(() => { */}
      {/*         if (product.lead_time_min && product.lead_time_max) */}
      {/*           return `${product.lead_time_min}-${product.lead_time_max} ${t`days`}`; */}
      {/*         else if (product.lead_time_min) return `${product.lead_time_min}+ ${t`days`}`; */}
      {/*         else if (product.lead_time_max) return `Up to ${product.lead_time_max} ${t`days`}`; */}
      {/*         return t`N/A`; */}
      {/*       })()} */}
      {/*     </p> */}
      {/*   </div> */}
      {/* </div> */}
    </Card>
  );
};
