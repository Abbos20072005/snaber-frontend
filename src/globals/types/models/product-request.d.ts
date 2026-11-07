interface QuickOrderLine {
  matches: ProductPreview[];
  name: string;
  quantity: number;
}

type ProductRequestStatus = 'done' | 'in_progress' | 'new';

interface ProductRequest {
  answer: string;
  buyer: Pick<User, 'full_name' | 'id' | 'phone_number'>;
  comment: string;
  created_at: string;
  file: null | string;
  id: number;
  items: {
    name: string;
    quantity: number;
  }[];
  status: ProductRequestStatus;
}

type ProductRequestsResponse = Pagination<ProductRequest>;

interface WantedProduct {
  last_requested_at: string;
  name: string;
  requests_count: number;
  total_quantity: number;
}

type WantedProductsResponse = Pagination<WantedProduct>;

// DTO

interface PatchProductRequestDto {
  answer?: string;
  status?: ProductRequestStatus;
}
