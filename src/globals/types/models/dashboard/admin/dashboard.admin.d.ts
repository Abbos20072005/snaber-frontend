type WeekDay = 'Friday' | 'Monday' | 'Saturday' | 'Sunday' | 'Thursday' | 'Tuesday' | 'Wednesday';

interface AdminLast30DaysStatistics {
  orders_count: number;
  total_spent: number;
  total_users_count: number;
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

interface AdminTodayOrders {
  orders_count: number;
}

interface AdminTopProductItem {
  product_name: string;
  orders_count: number;
  orders_total: string;
}

type AdminTopProduct = AdminTopProductItem[];

interface AdminUserCounts {
  admins: number;
  buyers: number;
  total_users: number;
}

interface AdminWeeklyJoinedUsersItem {
  count: number;
  day: string;
}

type AdminWeeklyJoinedUsers = AdminWeeklyJoinedUsersItem[];
