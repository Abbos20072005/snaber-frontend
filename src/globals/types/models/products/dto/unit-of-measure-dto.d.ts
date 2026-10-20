interface UnitOfMeasureDto {
  unit_en: string;
  unit_ru: string;
  unit_uz: string;
}

type PostUnitOfMeasureDto = UnitOfMeasureDto;
type PatchUnitOfMeasureDto = Partial<UnitOfMeasureDto>;
