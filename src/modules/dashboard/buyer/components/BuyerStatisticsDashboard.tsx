import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ReceiptTextIcon, ShoppingBagIcon } from 'lucide-react';

import { getBuyerKPIsQueryOptions, RecentBuyingActivityTable } from '@/modules/dashboard/buyer';
import { formatPrice } from '@/shared/lib/format';

import { BuyerDashboardHero } from './BuyerDashboardHero';
import { MetricCard } from './MetricCard';
import { PurchaseMomentumChart } from './PurchaseMomentumChart';

export const BuyerStatisticsDashboard = () => {
  const { t } = useLingui();
  const { estimated_spend, total_orders } = useSuspenseQuery(getBuyerKPIsQueryOptions()).data;

  return (
    <section className='space-y-4'>
      <BuyerDashboardHero />

      <div className='grid gap-3 md:grid-cols-2'>
        <MetricCard
          label={t`Total orders`}
          value={String(total_orders)}
          description={t`All orders loaded for this buyer profile.`}
          icon={ShoppingBagIcon}
        />
        <MetricCard
          label={t`Estimated spend`}
          value={`${formatPrice(estimated_spend)} ${t`so'm`}`}
          description={t`Calculated from product prices and quantities.`}
          icon={ReceiptTextIcon}
        />
      </div>

      <div className='grid gap-4'>
        <PurchaseMomentumChart />
      </div>

      <RecentBuyingActivityTable />
    </section>
  );
};
