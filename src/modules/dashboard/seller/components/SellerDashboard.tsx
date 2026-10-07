import { PageContent } from '@/shared/ui/page';

import { BuyerEngagementChart } from './BuyerEngagementChart';
import { RevenueMomentumChart } from './RevenueMomentumChart';
import { RfqPipelineChart } from './RfqPipelineChart';
import { SalesByCategoryChart } from './SalesByCategoryChart';
import { SellerHeroSummary } from './SellerHeroSummary';
import { SellerKpiCards } from './SellerKpiCards';
import { SellerRecentOrdersTable } from './SellerRecentOrdersTable';
import { SellerTopProductsTable } from './SellerTopProductsTable';

export const SellerDashboard = () => {
  return (
    <PageContent className='bg-muted/20'>
      <div className='space-y-6 p-6'>
        <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]'>
          <SellerHeroSummary />
        </div>

        <SellerKpiCards />

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]'>
          <RevenueMomentumChart />
          <SalesByCategoryChart />
        </div>

        <div className='grid gap-4 xl:grid-cols-3'>
          <BuyerEngagementChart />
          <RfqPipelineChart />
        </div>

        <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]'>
          <SellerTopProductsTable />
          <SellerRecentOrdersTable />
        </div>
      </div>
    </PageContent>
  );
};
