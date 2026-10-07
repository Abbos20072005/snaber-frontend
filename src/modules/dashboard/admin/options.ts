import { queryOptions } from '@tanstack/react-query';

import {
  getAdminLast30DaysStatistics,
  getAdminMonthlyRevenue,
  getAdminOrdersByCategory,
  getAdminRFQOrdersByStatus,
  getAdminTodayOrders,
  getAdminTopCompanies,
  getAdminUserCounts,
  getAdminWeeklyJoinedUsers
} from '@/shared/api/requests/dashboard';

export const ADMIN_DASHBOARD_QUERY_KEYS = {
  base: () => ['admin-dashboard'] as const,
  last30DaysStatistics: () =>
    [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'last-30-days-statistics'] as const,
  monthlyRevenue: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'monthly-revenue'] as const,
  ordersByCategory: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'orders-by-category'] as const,
  rfqOrdersByStatus: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'rfq-orders-by-status'] as const,
  todayOrders: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'today-orders'] as const,
  topCompanies: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'top-companies'] as const,
  userCounts: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'user-counts'] as const,
  weeklyJoinedUsers: () => [...ADMIN_DASHBOARD_QUERY_KEYS.base(), 'weekly-joined-users'] as const
} as const;

export const getAdminLast30DaysStatisticsQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.last30DaysStatistics(),
    queryFn: getAdminLast30DaysStatistics
  });

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

export const getAdminRFQOrdersByStatusQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.rfqOrdersByStatus(),
    queryFn: getAdminRFQOrdersByStatus
  });

export const getAdminTodayOrdersQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.todayOrders(),
    queryFn: getAdminTodayOrders
  });

export const getAdminTopCompaniesQueryOptions = () =>
  queryOptions({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.topCompanies(),
    queryFn: getAdminTopCompanies
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
