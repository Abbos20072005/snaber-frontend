import { api } from '@/shared/api';

export interface GetGalleriesCompanyRequest {
  companyId: number;
}

export const getGalleriesByCompany = ({ companyId }: GetGalleriesCompanyRequest) =>
  api.get<GalleriesResponse>(`company/galleries/${companyId}/`);

export interface GetGalleryByIdRequest {
  id: number;
}

export const getGalleryById = ({ id }: GetGalleryByIdRequest) =>
  api.get<Gallery>(`company/gallery/${id}`);

interface PostGalleryRequest {
  data: PostGalleryDto;
}

export const postGallery = ({ data }: PostGalleryRequest) =>
  api.post('company/gallery/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchGalleryRequest {
  data: PatchGalleryDto;
  id: number;
}

export const patchGallery = ({ id, data }: PatchGalleryRequest) =>
  api.patch(`company/gallery/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface DeleteGalleryRequest {
  id: number;
}

export const deleteGallery = ({ id }: DeleteGalleryRequest) => api.delete(`company/gallery/${id}/`);
