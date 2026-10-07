import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { BuildingIcon, ShoppingCartIcon } from 'lucide-react';

import { useAuth } from '@/modules/auth';
import { CartCompanySection, CartOrderSummary } from '@/modules/cart';
import { currencySymbolMap } from '@/modules/currency';
import { getCartListQueryOptions } from '@/modules/products';
// FEATURE DISABLED: Company mini-site link.
// import { generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
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

  const { user } = useAuth();

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
          <span className='text-muted-foreground text-xs'>{t`Companies`}:</span>
          <span className='text-sm font-medium'>{carts?.companies}</span>
        </Button>

        <Button variant='outline'>
          <span className='text-muted-foreground text-xs'>{t`Products`}:</span>
          <span className='text-sm font-medium'>{carts?.products}</span>
        </Button>

        <Button variant='outline'>
          <span className='text-muted-foreground text-xs'>{t`Total`}:</span>
          <span className='text-primary text-sm font-bold'>
            {formatPrice(carts?.total_amount || 0)}{' '}
            {user?.currency && currencySymbolMap[user?.currency]}
          </span>
        </Button>
      </div>

      {cartQuery.isPending ? (
        <div className='space-y-5'>
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div
              key={sectionIndex}
              className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'
            >
              <div className='space-y-3'>
                <div className='bg-card flex items-center gap-2 rounded-lg border px-2 py-1.5'>
                  <Skeleton className='size-8 rounded-full' />
                  <Skeleton className='h-4 w-40' />
                  <Skeleton className='h-5 w-14 rounded-full' />
                </div>
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
      ) : carts?.groups.length === 0 ? (
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
        <div className='space-y-5'>
          {carts?.groups.map((cart) => (
            <div
              key={cart.company.id}
              className='grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]'
            >
              <div className='space-y-3'>
                {/* FEATURE DISABLED: Company mini-site link. */}
                {/* <Link
                  className='bg-card hover:border-primary/50 hover:bg-muted/40 flex items-center gap-4 rounded-lg border px-2 py-1.5 transition-colors'
                  params={{ slug: generateSlugId(cart.company.id, cart.company.name) }}
                  to='/companies/$slug'
                > */}
                <div className='bg-card flex items-center gap-4 rounded-lg border px-2 py-1.5'>
                  <div className='flex items-center gap-2'>
                    <Avatar className='size-8 shrink-0'>
                      <AvatarImage alt={cart.company.name} src={cart.company.logo} />
                      <AvatarFallback>
                        <BuildingIcon className='size-3.5' />
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-semibold'>{cart.company.name}</p>
                      <p className='text-muted-foreground text-[11px] leading-4'>
                        {formatPrice(cart.total_price)}{' '}
                        {user?.currency && currencySymbolMap[user?.currency]}
                      </p>
                    </div>
                  </div>
                  <Badge className='h-5 shrink-0 px-1.5 text-[11px]' variant='secondary'>
                    {cart.items.length}
                  </Badge>
                </div>
                {/* </Link> */}
                <CartCompanySection cart={cart} />
              </div>
              <CartOrderSummary cart={cart} />
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export const Route = createFileRoute('/(main)/cart/')({
  component: RouteComponent
});
