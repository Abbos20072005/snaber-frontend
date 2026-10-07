interface MiniSiteDto {
  address: string;
  avg_answer_time: string;
  avg_delivery_time: string;
  cover: File;
  description_en: string;
  description_ru: string;
  description_uz: string;
  email: string;
  facebook?: string | null;
  industries: string[];
  instagram?: string | null;
  latitude: number;
  logo: File;
  longitude: number;
  name_en: string;
  name_ru: string;
  name_uz: string;
  own_site?: string | null;
  phone: string;
  region: number;
  status: string;
  telegram?: string | null;
  whatsapp?: string | null;
  youtube?: string | null;
  features: {
    name_uz: string;
    name_ru: string;
    name_en: string;
  }[];
}

type PostMiniSiteDto = MiniSiteDto;
type PatchMiniSiteDto = Partial<MiniSiteDto>;
