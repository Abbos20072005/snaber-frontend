interface Category {
  children?: Category[];
  code: string;
  id: number;
  image: string;
  is_active: boolean;
  is_leaf: boolean;
  level: number;
  name: string;
  name_en?: string;
  name_ru?: string;
  name_uz?: string;
  parent: Category | null;
}

interface CategoryById extends Category {
  children: Category[];
}

interface PublicCategoryById extends Category {
  children: Category[];
}

interface Breadcrumb {
  id: number;
  name: string;
}

type PublicAllCategoriesResponse = Category[];
type CategoryBreadcrumbResponse = Breadcrumb[];
type PublicCategoryByIdResponse = PublicCategoryById;

// Request DTOs

interface CategoryDTO {
  code: string;
  image: File;
  is_active?: boolean;
  name_en: string;
  name_ru: string;
  name_uz: string;
  parent?: string | null;
}
