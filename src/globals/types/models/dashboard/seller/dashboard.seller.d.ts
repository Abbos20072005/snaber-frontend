type WeekDay = 'Friday' | 'Monday' | 'Saturday' | 'Sunday' | 'Thursday' | 'Tuesday' | 'Wednesday';

interface BuyerEngagementItem {
  chats: number;
  day: WeekDay;
  views: number;
}

type BuyerEngagement = BuyerEngagementItem[];

interface HeroSummary {
  dispatch_due_today: number;
  monthly_growth: number;
  unread_buyer_chats: number;
}

interface KPIItem {
  delta: number;
  value: number;
}

type KPIResponse = KPIItem[];

interface RecentOrder {
  amount: number;
  buyer: string;
  order: string;
  status: OrderStatus;
}

type RecentOrders = RecentOrder[];

interface RevenueMomentumItem {
  month: string;
  orders: number;
  quotes: number;
  revenue: number;
}

type RevenueMomentum = RevenueMomentumItem[];

interface RFQPipeline {
  accepted: number;
  closed: number;
  negotiation: number;
  new: number;
  pending: number;
  rejected: number;
}

interface SalesByCategoryItem {
  category_name: string;
  orders_count: number;
}

type SalesByCategory = SalesByCategoryItem[];

interface TopProduct {
  orders: number;
  product: string;
  product_id: number;
  revenue: number;
  sku: string;
  stock_health: number;
}

type TopProducts = TopProduct[];
