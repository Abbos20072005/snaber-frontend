interface AttributeValueDto {
  attribute: number;
  image: File;
  value_en: string;
  value_ru: string;
  value_uz: string;
}

type PostAttributeValueDto = AttributeValueDto;
type PatchAttributeValueDto = Partial<AttributeValueDto>;
