import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';

import { CartItems, CartOrderSummary } from '@/modules/cart';
import { getCartListQueryOptions } from '@/modules/products';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { SectionWrapper } from '@/shared/ui/section-wrapper';
import { Skeleton } from '@/shared/ui/skeleton';

const RouteComponent = () => {
  const { t } = useLingui();
  const cartQuery = useQuery(getCartListQueryOptions());
  const carts = cartQuery.data;

  return (
    <SectionWrapper title={t`Cart`}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t`Cart`}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex flex-wrap items-center gap-4'>
        <Button variant='outline'>
          <span className='text-muted-foreground text-xs'>{t`Products`}:</span>
          <span className='text-sm font-medium'>{carts?.products}</span>
        </Button>

        <Button variant='outline'>
          <span className='text-muted-foreground text-xs'>{t`Total`}:</span>
          <span className='text-primary text-sm font-bold'>
            {formatPrice(carts?.total_amount || 0)} {CURRENCY_SYMBOL}
          </span>
        </Button>
      </div>

      {cartQuery.isPending ? (
        <div className='space-y-5'>
          {Array.from({ length: 1 }).map((_, sectionIndex) => (
            <div
              key={sectionIndex}
              className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'
            >
              <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <Card key={itemIndex}>
                    <CardContent className='flex gap-4 pt-6'>
                      <Skeleton className='size-20 rounded-lg' />
                      <div className='flex-1 space-y-3'>
                        <Skeleton className='h-4 w-3/4' />
                        <Skeleton className='h-3 w-32' />
                        <Skeleton className='h-4 w-36' />
                      </div>
                      <div className='hidden w-32 space-y-4 sm:block'>
                        <Skeleton className='h-9 rounded-md' />
                        <Skeleton className='h-9 rounded-md' />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardContent className='space-y-4 pt-6'>
                  <Skeleton className='h-5 w-36' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-4/5' />
                  <Skeleton className='h-10 w-full rounded-md' />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : carts?.items.length === 0 ? (
        <Empty className='w-full'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <ShoppingCartIcon className='text-muted-foreground' />
            </EmptyMedia>
            <EmptyTitle>{t`Your cart is empty`}</EmptyTitle>
            <EmptyDescription>
              {t`Browse the catalog and add items to get started.`}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        carts && (
          <div className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'>
            <CartItems items={carts.items} />
            <CartOrderSummary cart={carts} />
          </div>
        )
      )}
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/cart/')({
  component: RouteComponent
});
