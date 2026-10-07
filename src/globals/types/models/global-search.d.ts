interface GlobalSearchProduct {
  category?: string;
  id: number;
  media?: string;
  name: string;
  owner?: string;
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

interface GlobalSearchCompany {
  id: number;
  logo?: string;
  name?: string;
  region: RegionList;
}

interface GlobalSearch {
  categories: GlobalSearchCategory[];
  companies: GlobalSearchCompany[];
  products: GlobalSearchProduct[];
}

type GetGlobalSearchResponse = GlobalSearch;
