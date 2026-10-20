interface ProductCharacteristicDto {
  name_en: string;
  name_ru: string;
  name_uz: string;
  value_en: string;
  value_ru: string;
  value_uz: string;
}

interface ProductDto {
  attribute_values: number[];
  category: number;
  characteristics: ProductCharacteristicDto[];
  description_en: string;
  description_ru: string;
  description_uz: string;
  discount_percent: number;
  is_active: boolean;
  name_en: string;
  name_ru: string;
  name_uz: string;
  price: number;
  sku: string;
  stock_quantity: number;
  unit: number | null;
}

type PostProductDto = ProductDto;
type PatchProductDto = Partial<ProductDto>;
