interface ProductVariantDto {
  description_en: string;
  description_ru: string;
  description_uz: string;
  images: File[];
  is_active: boolean;
  moq_override: number;
  price_override: number;
  product: number;
  product_constructor: number;
  sku_variant: string;
  stock_quantity: number;
  attribute_stocks: {
    attribute_values: number[];
    quantity: number;
  }[];
  attributes: {
    attribute: number;
    value: number;
  }[];
  characteristics: {
    name: string;
    value: string;
  }[];
}

type PostProductVariantDto = ProductVariantDto;
type PatchProductVariantDto = Partial<ProductVariantDto>;
