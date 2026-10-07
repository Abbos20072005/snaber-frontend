interface Gallery {
  id: number;
  image: string;
  title: string;
  title_en: string;
  title_ru: string;
  title_uz: string;
}

// Responses
type GalleriesResponse = Gallery[];
