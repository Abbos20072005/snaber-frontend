type OrderStatus = 'accepted' | 'negotiation' | 'rejected';
type OrderType = 'both' | 'ready' | 'rfq';

interface Order {
  accepted_by_buyer: boolean;
  accepted_by_seller: boolean;
  buyer: User;
  company: Company;
  created_at: string;
  id: number;
  is_closed: boolean;
  order_type: OrderType;
  quantity: number;
  rejected_by_buyer: boolean;
  rejected_by_seller: boolean;
  status: OrderStatus;
  total_price: string;
  items: {
    product: OrderProduct;
    quantity: number;
    attribute_stock?: ProductVariantAttributeStock;
    deadline?: string;
    attributes?: {
      attribute: number;
      value?: string;
      value_option?: {
        id: number;
        value: string;
      };
    }[];
    total_price: string;
    variant: ProductVariant;
  }[];
}

type OrdersResponse = Pagination<Order>;

// OLD CODES
type OrderStatusFilter = 'all' | OrderStatus;

interface OrderProductItemTest {
  id: number;
  image: string;
  name: string;
  quantity: number;
  sku: string;
  total_price: number;
  unit_price: number;
}

interface OrderDetailTest {
  buyer: string;
  chat_thread: ChatThread;
  created_at: string;
  delivery_address: string;
  expected_delivery: string;
  id: number;
  payment_method: string;
  products: OrderProductItemTest[];
  status: OrderStatus;
  total: number;
}
