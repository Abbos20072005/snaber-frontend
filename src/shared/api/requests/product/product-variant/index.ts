import { api } from '@/shared/api';

export interface GetProductVariantsRequest {
  id: string;
}

export const getProductVariant = ({ id }: GetProductVariantsRequest) =>
  api.get<ProductVariantPreview>(`product/variants/${id}/`);

interface PostProductVariantRequest {
  data: FormData;
}

export const postProductVariant = ({ data }: PostProductVariantRequest) =>
  api.post<ApiResponse<ProductVariant>>('product/variants/', data, {
    headers: {
      'Content-Type': '/multipartform-data'
    }
  });

interface PatchProductVariantRequest {
  data: FormData;
  id: number;
}

export const patchProductVariant = ({ id, data }: PatchProductVariantRequest) =>
  api.patch<ApiResponse<ProductVariant>>(`product/variants/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface DeleteProductVariantRequest {
  id: string;
}

export const deleteProductVariants = ({ id }: DeleteProductVariantRequest) =>
  api.delete(`product/variants/${id}/`);
