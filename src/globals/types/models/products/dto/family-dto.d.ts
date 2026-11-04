interface FamilyDto {
  axes: number[];
  category: number;
  name_en: string;
  name_ru: string;
  name_uz: string;
  // Products to put into the family right away.
  products: number[];
}

type PostFamilyDto = FamilyDto;
type PatchFamilyDto = Partial<FamilyDto>;

interface VariantItemDto {
  attribute_values: number[];
  price?: number;
  sku: string;
  stock_quantity?: number;
}

interface PostVariantsDto {
  base_product: number;
  items: VariantItemDto[];
}
