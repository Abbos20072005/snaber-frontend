interface AttributeValue {
  attribute: Omit<Attribute, 'category'>;
  id: number;
  image: string | null;
  value: string;
  value_en: string;
  value_ru: string;
  value_uz: string;
}

type AttributeValuesResponse = Pagination<AttributeValue>;
