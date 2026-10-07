import { useLingui } from '@lingui/react/macro';

import useFancybox from '@/shared/hooks/useFancybox';
import { Card, CardContent } from '@/shared/ui/card';

import type { ProductDetailMediaItem } from './constants';

interface ProductDetailMediaTabProps {
  medias: ProductDetailMediaItem[];
}

export const ProductDetailMediaTab = ({ medias }: ProductDetailMediaTabProps) => {
  const { t } = useLingui();
  const { fancyboxRef } = useFancybox();

  if (medias.length === 0) {
    return (
      <Card>
        <CardContent className='py-10 text-center'>
          <p className='text-muted-foreground text-sm'>{t`No media assets available for this product.`}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={fancyboxRef} className='grid grid-cols-[repeat(auto-fill,minmax(176px,1fr))] gap-4'>
      {medias.map((media) => (
        <a
          href={media.file}
          key={media.file}
          aria-label={`${media.variant.sku_variant} ${media.product_media_type}`}
          className='group block overflow-hidden rounded-md border'
          data-type={media.product_media_type === 'video' ? 'html5video' : undefined}
          data-caption={`${media.variant.sku_variant} · ${media.product_media_type}`}
          data-fancybox='product-detail-media'
        >
          {media.product_media_type === 'video' ? (
            <video
              muted
              playsInline
              className='h-44 w-full object-cover transition duration-300 group-hover:scale-105'
              src={media.file}
            />
          ) : (
            <img
              alt={media.variant.sku_variant}
              className='aspect-square h-44 w-full object-cover transition duration-300 group-hover:scale-105'
              src={media.file}
            />
          )}
        </a>
      ))}
    </div>
  );
};
