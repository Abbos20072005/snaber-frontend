interface ProductVariantBase {
  id: number;
  is_active: boolean;
  moq_override: number;
  price_override: number;
  sku_variant: string;
  stock_quantity: number;
}

interface ProductVariantPreview extends ProductVariantBase {
  description: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  product: number;
}

interface ProductVariant extends ProductVariantBase {
  attribute_stocks: ProductVariantAttributeStock[];
  attributes: ProductVariantAttribute[];
  constructor_id: number;
  description: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  variant_constructor_id: number;
  characteristics: {
    name: string;
    value: string;
  }[];
  medias: {
    product_variant: number;
    file: string;
    product_media_type: 'photo' | 'video';
  }[];
}
