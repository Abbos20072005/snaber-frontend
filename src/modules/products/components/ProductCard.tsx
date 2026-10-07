import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { EyeIcon } from 'lucide-react';
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
// import { Button } from '@/shared/ui/button';
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
    <Card className={cn('@container pt-0!', className)} size='sm'>
      <div className='relative'>
        <Link
          className='block h-60'
          params={{ slug: generateSlugId(productId, product.name) }}
          to='/product/$slug'
        >
          <Carousel data-product-image-carousel>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image}>
                  <img
                    alt={t`Product image`}
                    className='h-60 w-full rounded-xl object-cover'
                    src={image}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <ProductImageIndicators images={images} />
          </Carousel>
        </Link>
        <div className='absolute top-0 flex w-full items-center justify-between gap-2 p-3'>
          <div className='flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-white backdrop-blur-sm'>
            <EyeIcon className='size-3' />
            <span className='text-xs font-medium'>{formatCount(product.view_count)}</span>
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
      </div>
      <CardContent className='space-y-3'>
        <div>
          <Link
            className='text-primary line-clamp-2 min-h-9.5 text-base leading-4.5 font-semibold hover:underline'
            params={{ slug: generateSlugId(productId, product.name) }}
            to='/product/$slug'
          >
            {product.name}
          </Link>
          <div className='my-1'>
            {product.product_type === 'both' ? (
              <div className='flex flex-wrap gap-2'>
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
              </div>
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

          {isShowCompany && (
            /* FEATURE DISABLED: Company mini-site link. */
            // <Link
            //   className='text-success text-xs hover:underline'
            //   params={{ slug: generateSlugId(product.company.id, product.company.name) }}
            //   to='/companies/$slug'
            // >
            //   {product.company.name}
            // </Link>
            <p className='text-success text-xs'>{product.company.name}</p>
          )}
        </div>
        <div className='space-y-3 border-b pb-4'>
          <div className='flex flex-wrap items-baseline gap-1'>
            <p className='text-primary text-base leading-none font-bold lg:text-lg'>
              {formatPrice(product.price_min)}
              {currencySymbolMap[product.currency]}
            </p>
            <p className='text-muted-foreground text-xs leading-none capitalize'>
              / {product.moq_unit.unit}
            </p>
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
      </CardContent>
    </Card>
  );
};
