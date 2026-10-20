interface CartItem {
  id: number;
  product: ProductPreview;
  quantity: number;
  total_price: string;
}

interface CartItemDto {
  product: number;
  quantity: number;
}

interface FullCart {
  items: CartItem[];
  products: number;
  total_amount: string;
}

type FullCardResponse = FullCart;
