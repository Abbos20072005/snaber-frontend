import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/ui/carousel';

import { ProductCard } from './ProductCard';

const shouldDragProductsCarousel = (_api: unknown, event: MouseEvent | TouchEvent) =>
  !(event.target instanceof Element && event.target.closest('[data-product-image-carousel]'));

type Props = ComponentProps<'div'> & {
  view?: 'carousel' | 'grid';
  products: ProductPreview[];
  isShowCompany?: boolean;
};

export const ProductList = ({
  view = 'carousel',
  products,
  isShowCompany,
  className,
  ...props
}: Props) => {
  return (
    <>
      {view === 'grid' && (
        <div
          className={cn(
            'grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] md:gap-4',
            className
          )}
          {...props}
        >
          {products.map((product) => {
            const productId = product.product_id ?? product.id;
            return <ProductCard key={productId} isShowCompany={isShowCompany} product={product} />;
          })}
        </div>
      )}
      {view === 'carousel' && (
        <>
          <div className={cn('relative overflow-x-auto py-4 md:hidden', className)} {...props}>
            <div className='flex gap-3'>
              {products.map((product) => {
                const productId = product.product_id ?? product.id;
                return (
                  <ProductCard
                    key={productId}
                    className='shrink-0 basis-57.5'
                    isShowCompany={isShowCompany}
                    product={product}
                  />
                );
              })}
            </div>
          </div>
          <Carousel
            className='hidden md:block'
            opts={{ align: 'start', watchDrag: shouldDragProductsCarousel }}
          >
            <CarouselContent className={cn('py-4', className)} {...props}>
              {products.map((product) => {
                const productId = product.product_id ?? product.id;
                return (
                  <CarouselItem key={productId} className='basis-1/3 lg:basis-1/4 xl:basis-1/5'>
                    <ProductCard
                      className='h-full'
                      isShowCompany={isShowCompany}
                      product={product}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      )}
    </>
  );
};
