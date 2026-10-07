interface AdminLast30DaysStatistics {
  orders_count: number;
  total_spent: number;
  total_users_count: number;
  verified_sellers_count: number;
}

interface AdminMonthlyRevenueItem {
  month: string;
  total: number;
}

type AdminMonthlyRevenue = AdminMonthlyRevenueItem[];

interface AdminOrdersByCategoryItem {
  category_name: string;
  orders_count: number;
}

type AdminOrdersByCategory = AdminOrdersByCategoryItem[];

interface AdminRFQOrdersByStatus {
  accepted: number;
  closed: number;
  negotiation: number;
  new: number;
  pending: number;
  rejected: number;
}

interface AdminTodayOrders {
  orders_count: number;
  rfq_orders_count: number;
}

interface AdminTopCompanyItem {
  company_name: string;
  orders_count: number;
  orders_total: string;
}

type AdminTopCompany = AdminTopCompanyItem[];

interface AdminUserCounts {
  buyers: number;
  sellers: number;
  total_users: number;
}

interface AdminWeeklyJoinedUsersItem {
  count: number;
  day: string;
}

type AdminWeeklyJoinedUsers = AdminWeeklyJoinedUsersItem[];
