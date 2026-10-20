interface Order {
  buyer: User;
  created_at: string;
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
