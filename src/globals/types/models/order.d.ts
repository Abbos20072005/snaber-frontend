interface OrderCustomItem {
  id: number;
  name: string;
  price: null | string;
  quantity: number;
  total_price: null | number;
}

interface Order {
  buyer: User;
  created_at: string;
  custom_items: OrderCustomItem[];
  id: number;
  total_price: string;
  items: {
    id: number;
    price: string;
    product: OrderProduct;
    quantity: number;
    total_price: string;
  }[];
}

type OrdersResponse = Pagination<Order>;
