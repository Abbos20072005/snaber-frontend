interface Cart {
  company: Company;
  items: CartItem[];
  total_price: string;
}

interface CartItem {
  attribute_stock?: ProductVariantAttributeStock;
  company: number;
  deadline: string | null;
  id: number;
  product: ProductPreview;
  quantity: number;
  total_price: string;
  variant: ProductVariant;
  attributes?: {
    attribute: number;
    value?: string;
    value_option?: {
      id: number;
      value: string;
    };
  }[];
}

interface CartItemDto {
  attribute_stock?: number;
  deadline?: string;
  product: number;
  quantity: number;
  attributes?: {
    attribute: number;
    value?: string;
    value_option?: number;
  }[];
}

interface FullCart {
  companies: number;
  groups: Cart[];
  products: number;
  total_amount: string;
}

type FullCardResponse = FullCart;
