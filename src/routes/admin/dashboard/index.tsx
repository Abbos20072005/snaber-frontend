import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import {
  BuyerSellerActivityChart,
  CategoryDemandChart,
  getAdminLast30DaysStatisticsQueryOptions,
  getAdminMonthlyRevenueQueryOptions,
  getAdminOrdersByCategoryQueryOptions,
  getAdminRFQOrdersByStatusQueryOptions,
  getAdminTodayOrdersQueryOptions,
  getAdminTopCompaniesQueryOptions,
  getAdminUserCountsQueryOptions,
  getAdminWeeklyJoinedUsersQueryOptions,
  MetricsCards,
  RevenueOrderMomentumChart,
  RfqOrdersByStatusChart,
  SellerVerificationChart,
  TopSellers
} from '@/modules/dashboard/admin';
import { Badge } from '@/shared/ui/badge';
import { PageContent } from '@/shared/ui/page';

const AdminDashboard = () => {
  const { t } = useLingui();

  const { orders_count, rfq_orders_count } = useSuspenseQuery(getAdminTodayOrdersQueryOptions())
    .data.data;

  return (
    <PageContent className='bg-muted/20'>
      <div className='space-y-4 py-2'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <Badge className='mb-3' variant='secondary'>
              {t`Marketplace command center`}
            </Badge>
            <h1 className='text-3xl font-semibold tracking-tight'>{t`Admin dashboard`}</h1>
            <p className='text-muted-foreground mt-2 max-w-2xl text-sm'>
              {t`Monitor B2B marketplace liquidity, supplier quality, RFQ conversion and order flow
              from one operational view.`}
            </p>
          </div>
          <div className='bg-background grid grid-cols-2 gap-2 rounded-lg border p-2 text-center'>
            <div className='px-4 py-2'>
              <p className='text-muted-foreground text-xs'>{t`Today`}</p>
              <p className='font-semibold'>{t`${orders_count} orders`}</p>
            </div>
            <div className='border-l px-4 py-2'>
              <p className='text-muted-foreground text-xs'>{t`Open RFQs`}</p>
              <p className='font-semibold'>{rfq_orders_count}</p>
            </div>
          </div>
        </div>

        <MetricsCards className='grid gap-4 md:grid-cols-2 xl:grid-cols-4' />

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]'>
          <RevenueOrderMomentumChart />
          <SellerVerificationChart />
        </div>

        <div className='grid gap-4 xl:grid-cols-3'>
          <RfqOrdersByStatusChart />
          <CategoryDemandChart />
        </div>

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]'>
          <BuyerSellerActivityChart />
          <TopSellers />
        </div>
      </div>
    </PageContent>
  );
};

export const Route = createFileRoute('/admin/dashboard/')({
  component: AdminDashboard,
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.prefetchQuery(getAdminLast30DaysStatisticsQueryOptions()),
      queryClient.prefetchQuery(getAdminMonthlyRevenueQueryOptions()),
      queryClient.prefetchQuery(getAdminOrdersByCategoryQueryOptions()),
      queryClient.prefetchQuery(getAdminRFQOrdersByStatusQueryOptions()),
      queryClient.prefetchQuery(getAdminTodayOrdersQueryOptions()),
      queryClient.prefetchQuery(getAdminTopCompaniesQueryOptions()),
      queryClient.prefetchQuery(getAdminUserCountsQueryOptions()),
      queryClient.prefetchQuery(getAdminWeeklyJoinedUsersQueryOptions())
    ])
});
