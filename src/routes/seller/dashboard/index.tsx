import { createFileRoute } from '@tanstack/react-router';

import {
  getSellerBuyerEngagementQueryOptions,
  getSellerHeroSummaryQueryOptions,
  getSellerKPISQueryOptions,
  getSellerRecentOrdersQueryOptions,
  getSellerRevenueMomentumQueryOptions,
  getSellerRFQPipelineQueryOptions,
  getSellerSalesByCategoryQueryOptions,
  getSellerTopProductsQueryOptions,
  SellerDashboard,
  SellerDashboardSkeleton
} from '@/modules/dashboard/seller';

export const Route = createFileRoute('/seller/dashboard/')({
  component: SellerDashboard,
  pendingComponent: SellerDashboardSkeleton,
  loader: ({ context: { queryClient } }) =>
    Promise.all([
      queryClient.prefetchQuery(getSellerBuyerEngagementQueryOptions()),
      queryClient.prefetchQuery(getSellerHeroSummaryQueryOptions()),
      queryClient.prefetchQuery(getSellerKPISQueryOptions()),
      queryClient.prefetchQuery(getSellerRecentOrdersQueryOptions()),
      queryClient.prefetchQuery(getSellerRevenueMomentumQueryOptions()),
      queryClient.prefetchQuery(getSellerRFQPipelineQueryOptions()),
      queryClient.prefetchQuery(getSellerSalesByCategoryQueryOptions()),
      queryClient.prefetchQuery(getSellerTopProductsQueryOptions())
    ])
});
