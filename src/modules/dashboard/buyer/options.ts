import { queryOptions } from '@tanstack/react-query';

import {
  getBuyerKPIs,
  getBuyerOrderTypeSplit,
  getBuyerPurchaseMomentum,
  getBuyerRecentBuyingActivity,
  getBuyerStatusMix,
  getBuyerSummary
} from '@/shared/api';

export const BUYER_DASHBOARD_QUERY_KEYS = {
  base: () => ['buyer-dashboard'] as const,
  kpis: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'kpis'] as const,
  orderTypeSplit: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'order-type-split'] as const,
  purchaseMomentum: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'purchase-momentum'] as const,
  recentBuyingActivity: () =>
    [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'recent-buying-activity'] as const,
  statusMix: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'status-mix'] as const,
  summary: () => [...BUYER_DASHBOARD_QUERY_KEYS.base(), 'summary'] as const
} as const;

export const getBuyerKPIsQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.kpis(),
    queryFn: getBuyerKPIs
  });

export const getBuyerOrderTypeSplitQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.orderTypeSplit(),
    queryFn: getBuyerOrderTypeSplit
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

export const getBuyerStatusMixQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.statusMix(),
    queryFn: getBuyerStatusMix
  });

export const getBuyerSummaryQueryOptions = () =>
  queryOptions({
    queryKey: BUYER_DASHBOARD_QUERY_KEYS.summary(),
    queryFn: getBuyerSummary
  });
