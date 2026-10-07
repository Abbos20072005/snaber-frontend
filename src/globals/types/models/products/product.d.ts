type PriceType = 'exact' | 'on_request' | 'range';
type ProductStatus = 'draft' | 'published';
type ProductType = 'both' | 'made_to_order' | 'ready';

interface ProductBase {
  created_at: string;
  currency: CurrencyCode;
  id: number;
  image: string;
  industries: Industry[];
  lead_time_max: number;
  lead_time_min: number;
  moq: number;
  moq_unit: UnitOfMeasure;
  name: string;
  price_max: number;
  price_min: number;
  price_type: PriceType;
  product_type: ProductType;
  sku: string;
  status: Status;
  updated_at: string;
  view_count: number;
}

interface ProductPreview extends ProductBase {
  category?: number;
  company: ProductCompany;
  constructor_id?: number;
  images?: string[];
  product_id?: number;
  variants: number;
}

interface Product extends Omit<ProductBase, 'id'> {
  company: ProductCompany;
  constructor_id: number;
  is_active: boolean;
  moderator_comment?: string;
  product_id: number;
  status: ProductDraftStatus;
  variants: ProductVariant[];
  category: {
    id: number;
    name: string;
  };
}

interface ProductCompany {
  id: number;
  logo: string;
  name: string;
  region: {
    id: number;
    name: string;
  };
}

interface PublicProduct extends Omit<ProductBase, 'id'> {
  company: ProductCompany;
  product_id: number;
  status: ProductStatus;
  variants: ProductVariant[];
  category: {
    id: number;
    name: string;
  };
}

interface OrderProduct {
  id: number;
  image?: string;
  moq: number;
  name: string;
  price_max: string;
  price_min: string;
  price_type: PriceType;
  product_id?: number;
  product_type: ProductType;
  sku: string;
}

// Responses

type PublicProductResponse = PublicProduct;
type PublicProductsResponse = Pagination<ProductPreview>;
type ProductPreviewsResponse = Pagination<ProductPreview>;
type MiniSiteProductPreviewsResponse = Pagination<ProductPreview>;
