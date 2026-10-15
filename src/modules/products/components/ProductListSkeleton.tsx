import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/shared/ui/carousel';

import { ProductCardSkeleton } from './ProductCardSkeleton';

type Props = ComponentProps<'div'> & {
  view?: 'carousel' | 'grid';
  count?: number;
  isShowCompany?: boolean;
};

export const ProductListSkeleton = ({
  view = 'carousel',
  count = 8,
  isShowCompany,
  className,
  ...props
}: Props) => {
  const items = Array.from({ length: count });

  if (view === 'grid') {
    return (
      <div
        className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4', className)}
        {...props}
      >
        {items.map((_, i) => (
          <ProductCardSkeleton key={i} isShowCompany={isShowCompany} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={cn('relative overflow-x-auto py-4 md:hidden', className)} {...props}>
        <div className='flex gap-3'>
          {items.map((_, i) => (
            <ProductCardSkeleton key={i} isShowCompany={isShowCompany} />
          ))}
        </div>
      </div>
      <Carousel className='hidden md:block' opts={{ align: 'start' }}>
        <CarouselContent className={cn('py-4', className)} {...props}>
          {items.map((_, i) => (
            <CarouselItem
              key={i}
              className='basis-[230px] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
            >
              <ProductCardSkeleton isShowCompany={isShowCompany} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};
