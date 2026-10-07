import { api } from '@/shared/api';

export interface GetAttributeValuesRequest {
  params?: Partial<{
    page: number;
    page_size: number;
    search: string;
    attribute: number;
  }>;
}

export const getAttributeValues = (request?: GetAttributeValuesRequest) =>
  api.get<AttributeValuesResponse>('product/attributes/values/', request);

interface PostAttributeValueRequest {
  data: PostAttributeValueDto;
}

export const postAttributeValue = ({ data }: PostAttributeValueRequest) =>
  api.post<AttributeValue>('product/attributes/values/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchAttributeValueRequest {
  data: PatchAttributeValueDto;
  id: number;
}

export const patchAttributeValue = ({ data, id }: PatchAttributeValueRequest) =>
  api.patch<AttributeValue>(`product/attributes/values/${id}/`, data);

interface DeleteAttributeValueRequest {
  id: number;
}

export const deleteAttributeValue = ({ id }: DeleteAttributeValueRequest) =>
  api.delete(`product/attributes/values/${id}/`);
