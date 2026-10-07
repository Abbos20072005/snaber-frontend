import { api } from '@/shared/api';

export interface GetUnitOfMeasuresRequest {
  params?: Partial<{
    unit: string;
  }>;
}

export const getUnitOfMeasures = (request?: GetUnitOfMeasuresRequest) =>
  api.get<UnitsOfMeasureResponse>('product/units/', {
    params: request?.params
  });

interface PostUnitOfMeasureRequest {
  data: PostUnitOfMeasureDto;
}

export const postUnitOfMeasure = ({ data }: PostUnitOfMeasureRequest) =>
  api.post<UnitOfMeasure>('product/units/', data);

interface PatchUnitOfMeasureRequest {
  data: PatchUnitOfMeasureDto;
  id: number;
}

export const patchUnitOfMeasure = ({ id, data }: PatchUnitOfMeasureRequest) =>
  api.patch<UnitOfMeasure>(`product/units/${id}/`, data);

interface DeleteUnitOfMeasureRequest {
  id: number;
}

export const deleteUnitOfMeasure = ({ id }: DeleteUnitOfMeasureRequest) =>
  api.delete(`product/units/${id}/`);
