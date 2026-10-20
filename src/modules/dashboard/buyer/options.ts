import { queryOptions } from '@tanstack/react-query';

import { getBuyerKPIs, getBuyerPurchaseMomentum, getBuyerRecentBuyingActivity } from '@/shared/api';

export const BUYER_DASHBOARD_QUERY_KEYS = {
  base: () => ['buyer-dashboard'] as const,
  kpis: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'kpis'] as const,
  purchaseMomentum: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'purchase-momentum'] as const,
  recentBuyingActivity: () =>
    [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'recent-buying-activity'] as const
} as const;

export const getBuyerKPIsQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.kpis(),
    queryFn: getBuyerKPIs
  });

export const getBuyerPurchaseMomentumQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.purchaseMomentum(),
    queryFn: getBuyerPurchaseMomentum
  });

export const getBuyerRecentBuyingActivityQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.recentBuyingActivity(),
    queryFn: getBuyerRecentBuyingActivity
  });
