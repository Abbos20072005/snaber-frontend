import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, EyeIcon } from 'lucide-react';
// FEATURE DISABLED: Favorites toggle.
// import { useMutation } from '@tanstack/react-query';
// import { HeartIcon } from 'lucide-react';
// import { toast } from 'sonner';

import { currencySymbolMap } from '@/modules/currency';
// FEATURE DISABLED: Favorites API + store.
// import { postFavouriteProduct } from '@/shared/api';
import { generateSlugId } from '@/shared/constants';
import { formatPrice, useFormatCount } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
// import { useFavoritesStore } from '@/shared/store';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

import { productTypeColorMap, productTypeLabelMap } from '../constants';
import { ProductImageIndicators } from './ProductImageIndicators';

interface Props {
  className?: string;
  isShowCompany?: boolean;
  product: ProductPreview;
}

export const ProductCard = ({ product, isShowCompany = true, className }: Props) => {
  const { t } = useLingui();
  // FEATURE DISABLED: Favorites toggle.
  // const { isFavorite, toggleFavorite } = useFavoritesStore();
  const productId = product.product_id ?? product.id;
  const images = product.images ?? [];
  const formatCount = useFormatCount();

  // const isFav = isFavorite(productId);

  // const postFavoriteMutation = useMutation({
  //   mutationFn: postFavouriteProduct,
  //   onError: () => {
  //     toggleFavorite(product);
  //   }
  // });

  // const onToggleFavorite = () => {
  //   const wasFavorite = isFav;

  //   toggleFavorite(product);

  //   if (!wasFavorite) toast(t`Added to favorites`);
  //   postFavoriteMutation.mutate({ data: { product_id: productId, is_favourite: !wasFavorite } });
  // };

  return (
    <Card className={cn('p-3 sm:p-4', className)} size='sm'>
      <div className='flex gap-3 sm:gap-4'>
        <div className='relative shrink-0'>
          <Link
            className='block h-24 w-24 sm:h-32 sm:w-32'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            <Carousel className='h-full' data-product-image-carousel>
              <CarouselContent className='h-full'>
                {images.map((image) => (
                  <CarouselItem key={image} className='h-full'>
                    <img
                      alt={t`Product image`}
                      className='h-full w-full rounded-lg border object-cover'
                      src={image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <ProductImageIndicators images={images} />
            </Carousel>
          </Link>
          <div className='absolute top-1 left-1 flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 text-white backdrop-blur-sm'>
            <EyeIcon className='size-3' />
            <span className='text-[10px] font-medium'>{formatCount(product.view_count)}</span>
          </div>
          {/* FEATURE DISABLED: Favorites toggle. */}
          {/* <Button */}
          {/*   className='size-5 cursor-pointer rounded-full p-4' */}
          {/*   variant='destructive' */}
          {/*   onClick={onToggleFavorite} */}
          {/* > */}
          {/*   <HeartIcon className={isFav ? 'fill-red-500' : ''} /> */}
          {/* </Button> */}
        </div>
        <CardContent className='flex min-w-0 flex-1 flex-col p-0'>
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
            className='mt-1 line-clamp-2 text-sm leading-5 font-semibold hover:underline sm:text-base'
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
            <p className='text-success mt-0.5 truncate text-xs'>{product.company.name}</p>
          )}
          <div className='mt-auto flex flex-wrap items-end justify-between gap-2 pt-2'>
            <div className='flex min-w-0 flex-wrap items-baseline gap-1'>
              <p className='text-lg leading-none font-extrabold sm:text-xl'>
                {formatPrice(product.price_min)}
                {currencySymbolMap[product.currency]}
              </p>
              <p className='text-muted-foreground text-xs leading-none capitalize'>
                / {product.moq_unit.unit}
              </p>
            </div>
            <Button
              className='shrink-0 bg-yellow-400 font-bold text-black hover:bg-yellow-300'
              size='sm'
              render={
                <Link
                  params={{ slug: generateSlugId(productId, product.name) }}
                  to='/product/$slug'
                >
                  {t`Details`}
                  <ArrowRightIcon />
                </Link>
              }
              variant='secondary'
            />
          </div>
        </CardContent>
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
