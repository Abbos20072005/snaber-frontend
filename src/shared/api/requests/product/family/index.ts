import { api } from '@/shared/api';

interface PostFamilyRequest {
  data: PostFamilyDto;
}

export const postFamily = ({ data }: PostFamilyRequest) =>
  api.post<ProductFamily>('product/families/', data);

interface PatchFamilyRequest {
  data: PatchFamilyDto;
  id: number;
}

export const patchFamily = ({ id, data }: PatchFamilyRequest) =>
  api.patch<ProductFamily>(`product/families/${id}/`, data);

interface DeleteFamilyRequest {
  id: number;
}

export const deleteFamily = ({ id }: DeleteFamilyRequest) => api.delete(`product/families/${id}/`);

interface PostFamilyVariantsRequest {
  data: PostVariantsDto;
  id: number;
}

export const postFamilyVariants = ({ id, data }: PostFamilyVariantsRequest) =>
  api.post<ProductFamily>(`product/families/${id}/variants/`, data);
