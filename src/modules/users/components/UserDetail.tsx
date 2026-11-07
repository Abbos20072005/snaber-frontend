import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  ArrowLeftIcon,
  CalendarClockIcon,
  PackageIcon,
  ReceiptTextIcon,
  ShoppingBagIcon,
  WalletIcon
} from 'lucide-react';

import { MetricCard } from '@/modules/dashboard/buyer/components/MetricCard';
import { getOrdersInfiniteQueryOptions, OrderCard } from '@/modules/order';
import { getUserByIdQueryOptions } from '@/modules/users';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatLocaleDate, formatPhoneNumber, formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  id: number;
}

export const UserDetail = ({ id }: Props) => {
  const { t } = useLingui();
  const user = useSuspenseQuery(getUserByIdQueryOptions({ id })).data;

  const ordersQuery = useInfiniteQuery(
    getOrdersInfiniteQueryOptions({ params: { buyer: id, page_size: 5 } })
  );
  const orders = ordersQuery.data?.pages.flatMap((item) => item.data.results) ?? [];

  const information = [
    { label: t`Full name`, value: user.full_name || '-' },
    {
      label: t`Phone number`,
      value: user.phone_number ? formatPhoneNumber(user.phone_number.replace('+', '')) : '-'
    },
    { label: 'Email', value: user.email || '-' },
    { label: t`Registered`, value: formatLocaleDate(user.created_at, 'PP') }
  ];

  return (
    <section className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <Link
          aria-label={t`Back`}
          className='text-muted-foreground hover:text-foreground'
          to='/admin/users'
        >
          <ArrowLeftIcon className='size-5' />
        </Link>
        <h1 className='text-primary text-2xl font-semibold'>
          {user.full_name || user.phone_number || user.email}
        </h1>
        <Badge variant={user.is_verified ? 'default' : 'outline'}>
          {user.is_verified ? t`Verified` : t`Not verified`}
        </Badge>
        <Badge variant={user.is_blocked ? 'destructive' : 'success'}>
          {user.is_blocked ? t`Blocked` : t`Active`}
        </Badge>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
        <MetricCard
          label={t`Total orders`}
          value={String(user.orders_count)}
          description={t`All orders made by this user.`}
          icon={ShoppingBagIcon}
        />
        <MetricCard
          label={t`Total spent`}
          value={`${formatPrice(user.total_spent)} ${t(CURRENCY_SYMBOL)}`}
          description={t`Sum of all order totals.`}
          icon={WalletIcon}
        />
        <MetricCard
          label={t`Average order`}
          value={`${formatPrice(user.average_order)} ${t(CURRENCY_SYMBOL)}`}
          description={t`Total spent divided by the number of orders.`}
          icon={ReceiptTextIcon}
        />
        <MetricCard
          label={t`Last order`}
          value={user.last_order_at ? formatLocaleDate(user.last_order_at, 'PP') : '-'}
          description={t`Date of the latest order.`}
          icon={CalendarClockIcon}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t`User information`}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <dl className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            {information.map((item) => (
              <div key={item.label}>
                <dt className='text-muted-foreground text-xs'>{item.label}</dt>
                <dd className='text-sm font-medium'>{item.value}</dd>
              </div>
            ))}
          </dl>
          {user.is_blocked && user.block_reason && (
            <p className='text-destructive text-sm'>
              {t`Block reason`}: {user.block_reason}
            </p>
          )}
        </CardContent>
      </Card>

      <h2 className='text-lg font-semibold'>{t`Orders`}</h2>

      {ordersQuery.isLoading && <Skeleton className='h-60 w-full rounded-lg' />}

      {!ordersQuery.isLoading && orders.length === 0 && (
        <Empty className='w-full'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <PackageIcon className='text-muted-foreground' />
            </EmptyMedia>
            <EmptyTitle>{t`No orders yet`}</EmptyTitle>
            <EmptyDescription>{t`New orders will appear here.`}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {ordersQuery.hasNextPage && (
        <div className='flex justify-center'>
          <Button
            type='button'
            variant='outline'
            loading={ordersQuery.isFetchingNextPage}
            onClick={() => ordersQuery.fetchNextPage()}
          >
            {t`Load more`}
          </Button>
        </div>
      )}
    </section>
  );
};
