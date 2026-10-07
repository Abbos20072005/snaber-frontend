interface AttributeDto {
  attribute_type: AttributeType;
  category: number;
  is_filterable: boolean;
  name_en: string;
  name_ru: string;
  name_uz: string;
}

type PostAttributeDto = AttributeDto;
type PatchAttributeDto = Partial<AttributeDto>;
