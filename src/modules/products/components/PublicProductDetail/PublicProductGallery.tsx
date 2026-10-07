import { Fancybox } from '@fancyapps/ui/dist/fancybox/';
import { useLingui } from '@lingui/react/macro';
import { ImageIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type { CarouselApi } from '@/shared/ui/carousel';

import { useIsMobile } from '@/shared/hooks/use-mobile';
import { cn } from '@/shared/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/ui/carousel';

import type { GalleryImage } from './helpers';

import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface ProductGalleryProps {
  activeImageSrc?: string;
  gallery: GalleryImage[];
  onActiveImageChange: (src: string) => void;
}

export const PublicProductGallery = ({
  activeImageSrc,
  gallery,
  onActiveImageChange
}: ProductGalleryProps) => {
  const { t } = useLingui();
  const isMobile = useIsMobile();

  const activeImage = useMemo(
    () => gallery.find((image) => image.src === activeImageSrc) || gallery[0],
    [activeImageSrc, gallery]
  );
  const [mainCarouselApi, setMainCarouselApi] = useState<CarouselApi>();
  const activeImageIndex = Math.max(
    gallery.findIndex((image) => image.src === activeImage?.src),
    0
  );

  useEffect(() => {
    if (!mainCarouselApi || gallery.length === 0) return;
    mainCarouselApi.scrollTo(activeImageIndex);
  }, [activeImageIndex, gallery.length, mainCarouselApi]);

  useEffect(() => {
    if (!mainCarouselApi) return;

    const handleSelect = () => {
      if (gallery.length === 0) return;

      const selectedImage = gallery[mainCarouselApi.selectedScrollSnap() % gallery.length];
      if (selectedImage) onActiveImageChange(selectedImage.src);
    };

    mainCarouselApi.on('select', handleSelect);

    return () => {
      mainCarouselApi.off('select', handleSelect);
    };
  }, [gallery, mainCarouselApi, onActiveImageChange]);

  const openGallery = (startIndex: number, thumbEl?: HTMLImageElement | null) => {
    Fancybox.show(
      gallery.map((image, index) => ({
        src: image.src,
        type: 'image',
        caption: image.label,
        thumbSrc: image.src,
        thumbEl: index === startIndex && thumbEl ? thumbEl : undefined
      })),
      {
        startIndex,
        closeExisting: true
      }
    );
  };

  return (
    <div className='grid gap-3 md:grid-cols-[80px_minmax(0,1fr)] md:items-start'>
      <Carousel
        className='hidden md:block md:max-h-125h w-full'
        opts={{ align: 'start', loop: gallery.length > 5 }}
        orientation={isMobile ? 'horizontal' : 'vertical'}
      >
        <CarouselContent className='max-h-100 md:h-100 xl:max-h-125 xl:h-125'>
          {gallery.map((image, index) => {
            const galleryIndex = index % gallery.length;
            return (
              <CarouselItem key={`${image.src}-${index}`} className='shrink-0 basis-auto'>
                <button
                  className={cn(
                    'ring-border aspect-square size-18 shrink-0 rounded-md ring-1',
                    activeImage?.src === image.src && 'ring-primary ring-2'
                  )}
                  type='button'
                  onClick={() => {
                    onActiveImageChange(image.src);
                    mainCarouselApi?.scrollTo(galleryIndex);
                  }}
                  onDoubleClick={(event) => {
                    openGallery(galleryIndex, event.currentTarget.querySelector('img'));
                  }}
                >
                  <img
                    alt={image.label}
                    className='size-full rounded-md object-cover'
                    src={image.src}
                  />
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <Carousel
        className='rounded-lg border bg-white'
        setApi={setMainCarouselApi}
        opts={{ align: 'start', loop: gallery.length > 2 }}
      >
        <CarouselContent className='-ml-2 h-100 xl:h-125'>
          {gallery.length > 0 ? (
            gallery.map((image, index) => (
              <CarouselItem key={`${image.src}-${index}`} className='h-full basis-full pl-2'>
                <button
                  aria-label={t`Open gallery preview`}
                  className='h-full w-full overflow-hidden rounded-lg text-left'
                  type='button'
                  onClick={(event) => {
                    openGallery(index, event.currentTarget.querySelector('img'));
                  }}
                >
                  <img
                    alt={image.label}
                    className='h-full w-full rounded-lg object-cover'
                    src={image.src}
                  />
                </button>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className='basis-full pl-2'>
              <div className='text-muted-foreground flex h-100 items-center justify-center xl:h-125'>
                <ImageIcon className='size-10' />
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious
          className='left-3 size-9 border shadow-sm backdrop-blur'
          variant='secondary'
        />
        <CarouselNext
          className='right-3 size-9 border shadow-sm backdrop-blur'
          variant='secondary'
        />
      </Carousel>
    </div>
  );
};
