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
  orders_count: number;
  orders_total: string;
  product_name: string;
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

type AdminOverviewPeriod = '30d' | '365d' | '7d' | '90d';

interface AdminKpis {
  active_buyers: number;
  average_order_value: string;
  new_users: number;
  orders_count: number;
  returning_buyers: number;
  revenue: string;
  units_sold: number;
}

interface AdminDailyPoint {
  date: string;
  orders_count: number;
  revenue: string;
}

interface AdminOverview {
  current: AdminKpis;
  daily: AdminDailyPoint[];
  days: number;
  end: string;
  period: AdminOverviewPeriod;
  previous: AdminKpis;
  previous_end: string;
  previous_start: string;
  start: string;
}

interface AdminAbandonedCart {
  customer: string;
  is_guest: boolean;
  items_count: number;
  last_activity: string;
  phone_number: string;
  total: string;
}

interface AdminAbandonedCarts {
  after_hours: number;
  carts_count: number;
  top: AdminAbandonedCart[];
  total_value: string;
}

interface AdminStockProduct {
  id: number;
  name: string;
  sku: string;
  stock_quantity: number;
  stock_value?: string;
}

interface AdminStockAlerts {
  dead_stock: AdminStockProduct[];
  dead_stock_count: number;
  dead_stock_days: number;
  dead_stock_value: string;
  low_stock: AdminStockProduct[];
  low_stock_count: number;
  low_stock_threshold: number;
  out_of_stock: AdminStockProduct[];
  out_of_stock_count: number;
}
