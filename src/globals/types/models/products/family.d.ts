interface FamilyAxisValue {
  id: number;
  value: string;
}

interface FamilyAxis {
  id: number;
  name: string;
  values: FamilyAxisValue[];
}

interface FamilyVariantOption {
  attribute: number;
  id: number;
  value: string;
}

interface FamilyVariant {
  discount_percent: number;
  final_price: string;
  id: number;
  image: string | null;
  is_active: boolean;
  name: string;
  // Option values of the family axes, and every option value of the variant.
  options: FamilyVariantOption[];
  price: string;
  sku: string;
  stock_quantity: number;
  unit: { id: number; unit: string } | null;
  values: number[];
}

interface ProductFamily {
  axes: FamilyAxis[];
  category: number;
  id: number;
  name: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  variants: FamilyVariant[];
}
