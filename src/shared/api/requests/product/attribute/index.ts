import { api, apiWithoutAuth } from '@/shared/api';

export interface GetAttributesByCategoryRequest {
  params?: Partial<{
    search: string;
    category: number;
  }>;
}

export const getAllAttributesByCategory = (request?: GetAttributesByCategoryRequest) =>
  api.get<AttributesResponse>('product/attributes/', {
    params: request?.params
  });

interface PostAttributeRequest {
  data: PostAttributeDto;
}

export const postAttribute = ({ data }: PostAttributeRequest) =>
  api.post<Attribute>('product/attributes/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export interface PatchAttributeRequest {
  data: PatchAttributeDto;
  id: number;
}

export const patchAttribute = ({ data, id }: PatchAttributeRequest) =>
  api.patch<Attribute>(`product/attributes/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface DeleteAttributeRequest {
  id: number;
}

export const deleteAttribute = ({ id }: DeleteAttributeRequest) =>
  api.delete(`product/attributes/${id}/`);

export interface GetPublicAttributesByCategoryRequest {
  categoryId: number;
}

export const getAttributesByCategory = ({ categoryId }: GetPublicAttributesByCategoryRequest) =>
  apiWithoutAuth.get<AttributesResponse>(`product/public/categories/${categoryId}/attributes/`);

export interface GetFilterRequest {
  params?: Partial<{
    category: number | string;
  }>;
}

export const getPublicFilter = (request?: GetFilterRequest) =>
  apiWithoutAuth.get<FilterResponse>('product/public/filter/', request);
