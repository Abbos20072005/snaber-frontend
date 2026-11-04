import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import {
  getAdminAbandonedCarts,
  getAdminMonthlyRevenue,
  getAdminOrdersByCategory,
  getAdminOverview,
  getAdminStockAlerts,
  getAdminTodayOrders,
  getAdminTopProducts,
  getAdminUserCounts,
  getAdminWeeklyJoinedUsers
} from '@/shared/api/requests/dashboard';

const ADMIN_DASHBOARD_QUERY_KEYS = {
  base: () => ['admin-dashboard'] as const,
  abandonedCarts: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'abandoned-carts'] as const,
  overview: (period: AdminOverviewPeriod) =>
    [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'overview', period] as const,
  stockAlerts: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'stock-alerts'] as const,
  last30DaysStatistics: () =>
    [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'last-30-days-statistics'] as const,
  monthlyRevenue: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'monthly-revenue'] as const,
  ordersByCategory: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'orders-by-category'] as const,
  todayOrders: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'today-orders'] as const,
  topProducts: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'top-products'] as const,
  userCounts: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'user-counts'] as const,
  weeklyJoinedUsers: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'weekly-joined-users'] as const
} as const;

export const getAdminMonthlyRevenueQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.monthlyRevenue(),
    queryFn: getAdminMonthlyRevenue
  });

export const getAdminOrdersByCategoryQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.ordersByCategory(),
    queryFn: getAdminOrdersByCategory
  });

export const getAdminTodayOrdersQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.todayOrders(),
    queryFn: getAdminTodayOrders
  });

export const getAdminTopProductsQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.topProducts(),
    queryFn: getAdminTopProducts
  });

export const getAdminUserCountsQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.userCounts(),
    queryFn: getAdminUserCounts
  });

export const getAdminWeeklyJoinedUsersQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.weeklyJoinedUsers(),
    queryFn: getAdminWeeklyJoinedUsers
  });

export const getAdminOverviewQueryOptions = (period: AdminOverviewPeriod) =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.overview(period),
    queryFn: () => getAdminOverview(period),
    placeholderData: keepPreviousData
  });

export const getAdminAbandonedCartsQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.abandonedCarts(),
    queryFn: getAdminAbandonedCarts
  });

export const getAdminStockAlertsQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.stockAlerts(),
    queryFn: getAdminStockAlerts
  });
