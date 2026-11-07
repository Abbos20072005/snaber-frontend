interface ProductBase {
  average_rating: string;
  category_path: string[];
  created_at: string;
  discount_percent: number;
  family_id: number | null;
  final_price: string;
  id: number;
  image: string | null;
  images: string[];
  is_active: boolean;
  name: string;
  price: string;
  sku: string;
  stock_quantity: number;
  unit: UnitOfMeasure | null;
  updated_at: string;
  variants_count: number;
  specifications: {
    name: string;
    value: string;
  }[];
}

interface ProductPreview extends ProductBase {
  category: number;
}

interface ProductMedia {
  file: string;
  id: number;
  position: number;
}

interface Product extends ProductBase {
  attributes: ProductAttribute[];
  characteristics: ProductCharacteristic[];
  description: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  family: ProductFamily | null;
  medias: ProductMedia[];
  name_en: string;
  name_ru: string;
  name_uz: string;
  category: {
    id: number;
    name: string;
  };
}

type PublicProduct = Product;

interface OrderProduct {
  id: number;
  image: string | null;
  name: string;
  sku: string;
  stock_quantity: number;
  unit: UnitOfMeasure | null;
}

// Responses

type PublicProductResponse = PublicProduct;
type PublicProductsResponse = Pagination<ProductPreview>;
type ProductPreviewsResponse = Pagination<ProductPreview>;
