import { api, apiWithoutAuth } from '@/shared/api';

export const getCategories = () => api.get<PublicAllCategoriesResponse>('product/category/');

export interface GetCategoryByIdRequest {
  id: number;
}

export const getCategoryById = ({ id }: GetCategoryByIdRequest) =>
  api.get<CategoryById>(`product/category/${id}/`).then(({ data }) => data);

interface PostCategoryRequest {
  data: CategoryDTO;
}

export const postCategory = ({ data }: PostCategoryRequest) =>
  api.post('product/category/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchCategoryRequest {
  data: Partial<CategoryDTO>;
  id: number;
}

export const patchCategory = ({ data, id }: PatchCategoryRequest) =>
  api.patch(`product/category/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface DeleteCategoryRequest {
  id: number;
}

export const deleteCategory = ({ id }: DeleteCategoryRequest) =>
  api.delete(`product/category/${id}/`);

export interface PublicAllCategoriesRequest {
  params?: {
    is_popular?: boolean;
  };
}

export const getPublicAllCategories = (request?: PublicAllCategoriesRequest) =>
  apiWithoutAuth
    .get<PublicAllCategoriesResponse>('product/public/categories/', {
      params: request?.params
    })
    .then(({ data }) => data);

export interface GetPublicCategoriesByIdRequest {
  id: number | string;
}
export const getPublicCategoryById = (request: GetPublicCategoriesByIdRequest) =>
  apiWithoutAuth
    .get<PublicCategoryByIdResponse>(`/product/public/categories/${request?.id}/`)
    .then(({ data }) => data);

export interface GetCategoryBreadcrumbsRequest {
  id: number | string;
}

export const getCategoryBreadcrumbById = (request?: GetCategoryBreadcrumbsRequest) =>
  apiWithoutAuth
    .get<CategoryBreadcrumbResponse>(`/product/public/categories/${request?.id}/breadcrumbs/`)
    .then(({ data }) => data);
