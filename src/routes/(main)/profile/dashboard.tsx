import { useLingui } from '@lingui/react/macro';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, BarChart3Icon } from 'lucide-react';

import {
  BuyerDashboardSkeleton,
  BuyerStatisticsDashboard,
  getBuyerKPIsQueryOptions,
  getBuyerPurchaseMomentumQueryOptions,
  getBuyerRecentBuyingActivityQueryOptions
} from '@/modules/dashboard/buyer';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

const BuyerStatisticPage = () => {
  const { t } = useLingui();
  return (
    <>
      <SectionWrapper
        className='md:hidden'
        content={
          <>
            <h2 className='text-primary flex items-center gap-1.5 text-xl font-bold'>
              <Link className='flex items-center gap-1 text-xs md:text-base' to='/profile'>
                <ArrowLeftIcon className='size-4' />
              </Link>
              <BarChart3Icon className='size-5' />
              {t`Dashboard`}
            </h2>
          </>
        }
      >
        <BuyerStatisticsDashboard />
      </SectionWrapper>
      <div className='hidden md:block'>
        <BuyerStatisticsDashboard />
      </div>
    </>
  );
};

export const Route = createFileRoute('/(main)/profile/dashboard')({
  component: BuyerStatisticPage,
  pendingComponent: BuyerDashboardSkeleton,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  loader: ({ context: { queryClient } }) => {
    if (typeof window === 'undefined') return;
    return Promise.all([
      queryClient.prefetchQuery(getBuyerKPIsQueryOptions()),
      queryClient.prefetchQuery(getBuyerPurchaseMomentumQueryOptions()),
      queryClient.prefetchQuery(getBuyerRecentBuyingActivityQueryOptions())
    ]);
  }
});
