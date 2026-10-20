type AttributeType = 'boolean' | 'multiselect' | 'number' | 'range' | 'select' | 'text';

interface Attribute {
  attribute_type: AttributeType;
  category: Omit<Category, 'parent'>;
  id: number;
  is_filterable: boolean;
  name: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  values: AttributeValue[];
}

interface ProductAttribute {
  attribute_type: AttributeType;
  category: number;
  id: number;
  is_filterable: boolean;
  name: string;
  value: {
    id: number;
    value: string;
  };
}

interface FilterAttribute extends Attribute {
  values: AttributeValue[];
}

interface FilterResponse {
  attributes: FilterAttribute[];
  price_max: number;
  price_min: number;
}

// APIs, responses

type AttributesResponse = Attribute[];
