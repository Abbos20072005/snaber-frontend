interface UnitOfMeasure {
  id: number;
  unit: string;
  unit_en?: string;
  unit_ru?: string;
  unit_uz?: string;
}

type UnitsOfMeasureResponse = UnitOfMeasure[];
