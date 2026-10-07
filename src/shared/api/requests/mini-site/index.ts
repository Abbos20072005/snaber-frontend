import { api } from '@/shared/api';

export interface GetMiniSiteByIdRequest {
  id: number;
}

export const getMiniSiteById = ({ id }: GetMiniSiteByIdRequest) =>
  api.get<MiniSite>(`company/${id}/`);

export const getSellerMiniSite = () => api.get<MiniSite>('company/seller/');

interface PostMiniSiteRequest {
  data: FormData | PostMiniSiteDto;
}

export const postMiniSite = ({ data }: PostMiniSiteRequest) =>
  api.post('company/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchMiniSiteRequest {
  data: FormData | PatchMiniSiteDto;
  id: number;
}

export const patchMiniSite = ({ id, data }: PatchMiniSiteRequest) =>
  api.patch(`company/${id}/`, data);

interface DeleteMiniSiteRequest {
  id: number;
}

export const deleteMiniSite = ({ id }: DeleteMiniSiteRequest) => api.delete(`company/${id}/`);

// Imports
export * from './certificates';
export * from './gallery';
export * from './product';
