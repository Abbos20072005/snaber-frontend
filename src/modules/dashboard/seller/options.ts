import { queryOptions } from '@tanstack/react-query';

import {
  getSellerBuyerEngagement,
  getSellerHeroSummary,
  getSellerKPIS,
  getSellerRecentOrders,
  getSellerRevenueMomentum,
  getSellerRFQPipeline,
  getSellerSalesByCategory,
  getSellerTopProducts
} from '@/shared/api';

export const SELLER_DASHBOARD_QUERY_KEYS = {
  base: () => ['seller-dashboard'] as const,
  buyerEngagement: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'buyer-engagement'] as const,
  heroSummary: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'hero-summary'] as const,
  kpis: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'kpis'] as const,
  recentOrders: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'recent-orders'] as const,
  revenueMomentum: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'revenue-momentum'] as const,
  rfqPipeline: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'rfq-pipeline'] as const,
  salesByCategory: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'sales-by-category'] as const,
  topProducts: () => [...SELLER_DASHBOARD_QUERY_KEYS.base(), 'top-products'] as const
} as const;

export const getSellerBuyerEngagementQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.buyerEngagement(),
    queryFn: getSellerBuyerEngagement
  });

export const getSellerHeroSummaryQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.heroSummary(),
    queryFn: getSellerHeroSummary
  });

export const getSellerKPISQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.kpis(),
    queryFn: getSellerKPIS
  });

export const getSellerRecentOrdersQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.recentOrders(),
    queryFn: getSellerRecentOrders
  });

export const getSellerRevenueMomentumQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.revenueMomentum(),
    queryFn: getSellerRevenueMomentum
  });

export const getSellerRFQPipelineQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.rfqPipeline(),
    queryFn: getSellerRFQPipeline
  });

export const getSellerSalesByCategoryQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.salesByCategory(),
    queryFn: getSellerSalesByCategory
  });

export const getSellerTopProductsQueryOptions = () =>
  queryOptions({
    queryKey: SELLER_DASHBOARD_QUERY_KEYS.topProducts(),
    queryFn: getSellerTopProducts
  });
