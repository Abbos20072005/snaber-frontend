interface BuyerKPIs {
  estimated_spend: number;
  total_orders: number;
}

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
}

type BuyerBuyingActivity = BuyerBuyingActivityItem[];
