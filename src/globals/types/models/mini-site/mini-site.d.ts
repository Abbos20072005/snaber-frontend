type MiniSiteStatus = 'active' | 'blocked' | 'draft' | 'inactive';

interface MiniSite {
  address: string;
  certificates: Certificate[];
  description: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  gallery: Gallery[];
  id: number;
  inn: string;
  logo: string;
  name: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  status: MiniSiteStatus;
  view_count: number;
  cover: {
    url: string;
    type: MediaType;
  } | null;
  features: {
    id: number;
    name: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
  }[];
  industries: {
    id: number;
    name: string;
  }[];
  info: {
    avg_answer_time: string;
    avg_delivery_time: string;
    longitude: number;
    latitude: number;
    phone: string;
    email: string;
    telegram: string | null;
    youtube: string | null;
    instagram: string | null;
    facebook: string | null;
    whatsapp: string | null;
    own_site: string | null;
  };
  region: {
    id: number;
    name: string;
  };
}
