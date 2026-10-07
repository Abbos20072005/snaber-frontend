interface ProductDto {
  category: number;
  constructor_id?: number;
  image: File;
  lead_time_max: number;
  lead_time_min: number;
  moq: number;
  moq_unit: number;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price_max: number;
  price_min: number;
  price_type: PriceType;
  product_type: ProductType;
  sku: string;
}

type PostProductDto = ProductDto;
type PatchProductDto = Partial<ProductDto>;
