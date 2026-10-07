interface BuyerKPIs {
  active_orders: number;
  estimated_spend: number;
  rfq_orders: number;
  total_orders: number;
}

interface OrderTypeSplitItem {
  count: number;
  type: OrderType;
}

type OrderTypeSplit = OrderTypeSplitItem[];

interface PurchaseMomentumItem {
  month: string;
  orders: number;
  spend: number;
}

type PurchaseMomentum = PurchaseMomentumItem[];

interface BuyerBuyingActivityItem {
  amount: number;
  date: string;
  id: number;
  product: string;
  quantity: number;
  status: OrderStatus;
  type: OrderType;
}

type BuyerBuyingActivity = BuyerBuyingActivityItem[];

interface StatusMixItem {
  count: number;
  status: OrderStatus;
}

type StatusMix = StatusMixItem[];

interface BuyerSummary {
  acceptance_rate: number;
  custom_requests: number;
  orders_in_progress: number;
}
