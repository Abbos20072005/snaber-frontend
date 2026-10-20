interface GlobalSearchProduct {
  category?: string;
  id: number;
  media?: string;
  name: string;
}

interface GlobalSearchCategory {
  code: string;
  id: number;
  image: string;
  is_active: boolean;
  is_leaf: boolean;
  level: number;
  name: string;
  name_en: string;
  name_ru: string;
  name_uz: string;
  parent?: number | null;
}

interface GlobalSearch {
  categories: GlobalSearchCategory[];
  products: GlobalSearchProduct[];
}

type GetGlobalSearchResponse = GlobalSearch;
