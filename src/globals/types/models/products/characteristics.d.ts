interface Characteristic {
  name: string;
  value: string;
}

interface ProductCharacteristic extends Characteristic {
  id: number;
  name_en: string;
  name_ru: string;
  name_uz: string;
  value_en: string;
  value_ru: string;
  value_uz: string;
}

type Characteristics = Characteristic[];
