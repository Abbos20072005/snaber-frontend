import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  ActivityIcon,
  BadgeCheckIcon,
  ClipboardListIcon,
  PackageCheckIcon,
  ReceiptTextIcon,
  ShoppingBagIcon
} from 'lucide-react';

import {
  getBuyerKPIsQueryOptions,
  getBuyerSummaryQueryOptions,
  RecentBuyingActivityTable
} from '@/modules/dashboard/buyer';
import { formatPrice } from '@/shared/lib/format';

import { BuyerDashboardHero } from './BuyerDashboardHero';
import { InsightCard } from './InsightCard';
import { MetricCard } from './MetricCard';
import { OrderStatusMixChart } from './OrderStatusMixChart';
import { OrderTypeSplitChart } from './OrderTypeSplitChart';
import { PurchaseMomentumChart } from './PurchaseMomentumChart';

export const BuyerStatisticsDashboard = () => {
  const { t } = useLingui();
  const { active_orders, estimated_spend, rfq_orders, total_orders } = useSuspenseQuery(
    getBuyerKPIsQueryOptions()
  ).data;
  const { acceptance_rate, custom_requests, orders_in_progress } = useSuspenseQuery(
    getBuyerSummaryQueryOptions()
  ).data;

  return (
    <section className='space-y-4'>
      <BuyerDashboardHero />

      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <MetricCard
          label={t`Total orders`}
          value={String(total_orders)}
          description={t`All orders loaded for this buyer profile.`}
          icon={ShoppingBagIcon}
        />
        <MetricCard
          label={t`Active orders`}
          value={String(active_orders)}
          description={t`Orders still moving through the workflow.`}
          icon={ActivityIcon}
        />
        <MetricCard
          label={t`RFQ orders`}
          value={String(rfq_orders)}
          description={t`Quote-based purchases and negotiations.`}
          icon={ClipboardListIcon}
        />
        <MetricCard
          label={t`Estimated spend`}
          value={`${formatPrice(estimated_spend)} ${t`so'm`}`}
          description={t`Calculated from quantity and variant price.`}
          icon={ReceiptTextIcon}
        />
      </div>

      <div className='grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]'>
        <PurchaseMomentumChart />
        <OrderStatusMixChart />
      </div>

      <div className='grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]'>
        <OrderTypeSplitChart />
        <RecentBuyingActivityTable />
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <InsightCard
          label={t`Acceptance rate`}
          value={`${acceptance_rate}%`}
          description={t`Accepted orders compared with all loaded orders.`}
          icon={BadgeCheckIcon}
        />
        <InsightCard
          label={t`Orders in progress`}
          value={String(orders_in_progress)}
          description={t`Open activity that may still need seller confirmation.`}
          icon={PackageCheckIcon}
        />
        <InsightCard
          label={t`Custom requests`}
          value={String(custom_requests)}
          description={t`Use RFQs when ready-made inventory does not match your needs.`}
          icon={ClipboardListIcon}
        />
      </div>
    </section>
  );
};
