interface Faq {
  description: string | null;
  description_en: string | null;
  description_ru: string | null;
  description_uz: string | null;
  id: number;
  name: string | null;
  name_en: string | null;
  name_ru: string | null;
  name_uz: string | null;
}

type FaqsResponse = Faq[];

interface FaqDTO {
  description_en: string;
  description_ru: string;
  description_uz: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
}
