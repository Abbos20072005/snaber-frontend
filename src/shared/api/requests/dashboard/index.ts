import { api } from '@/shared/api';

export const getAdminLast30DaysStatistics = () =>
  api.get<AdminLast30DaysStatistics>('dashboards/admins/last-30-days-stats/');

export const getAdminMonthlyRevenue = () =>
  api.get<AdminMonthlyRevenue>('dashboards/admins/monthly-revenue/');

export const getAdminOrdersByCategory = () =>
  api.get<AdminOrdersByCategory>('dashboards/admins/orders-by-category/');

export const getAdminRFQOrdersByStatus = () =>
  api.get<AdminRFQOrdersByStatus>('dashboards/admins/rfq-orders-by-status/');

export const getAdminTodayOrders = () =>
  api.get<AdminTodayOrders>('dashboards/admins/today-orders/');

export const getAdminTopCompanies = () =>
  api.get<AdminTopCompany>('dashboards/admins/top-companies/');

export const getAdminUserCounts = () => api.get<AdminUserCounts>('dashboards/admins/user-counts/');

export const getAdminWeeklyJoinedUsers = () =>
  api.get<AdminWeeklyJoinedUsers>('dashboards/admins/weekly-joined-users/');

export * from './buyer';
export * from './seller';
