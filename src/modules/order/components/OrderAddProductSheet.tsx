import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import {
  getPublicProductsInfiniteOptions,
  ProductCard,
  ProductCardSkeleton
} from '@/modules/products';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/shared/ui/sheet';
import { Spinner } from '@/shared/ui/spinner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderAddProductSheet = ({ open, onOpenChange }: Props) => {
  const { t } = useLingui();

  const productInfiniteQuery = useInfiniteQuery(getPublicProductsInfiniteOptions());

  const { ref, inView } = useInView({
    threshold: 0
  });

  const products = useMemo(
    () => productInfiniteQuery.data?.pages.flatMap((page) => page.results) || [],
    [productInfiniteQuery.data?.pages]
  );

  useEffect(() => {
    if (!inView || productInfiniteQuery.isLoading) return;
    if (inView && productInfiniteQuery.hasNextPage) void productInfiniteQuery.fetchNextPage();
  }, [ref, inView, productInfiniteQuery.hasNextPage, products.length]);

  return (
    <>
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent className='h-full sm:min-w-5xl'>
          <SheetHeader>
            <SheetTitle>{t`Add product to order`}</SheetTitle>
            <SheetDescription>{t`Select a product to add to the order.`}</SheetDescription>
          </SheetHeader>
          <ScrollArea className='min-h-0 flex-1'>
            <div className='grid flex-1 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-y-clip p-4 py-4'>
              {productInfiniteQuery.isPending &&
                Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={index} />)}
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {productInfiniteQuery.isFetchingNextPage && <Spinner className='mx-auto' />}
          </ScrollArea>
          {!(productInfiniteQuery.isFetchingNextPage || productInfiniteQuery.isPending) && (
            <div ref={ref} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
