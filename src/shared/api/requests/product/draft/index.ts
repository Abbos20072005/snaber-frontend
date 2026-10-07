import { api } from '@/shared/api/instance';

interface DeleteProductDraftVariantRequest {
  id: number;
}

export const deleteProductDraftVariant = ({ id }: DeleteProductDraftVariantRequest) =>
  api.delete(`product/constructor/variant/${id}/`);

export interface PatchProductDraftRequest {
  data: PatchConstructorReviewDto;
  id: number;
}

export const patchProductDraft = (request?: PatchProductDraftRequest) =>
  api.patch<ProductConstructor>(`product/draft/product/${request?.id}/`, request?.data);

export interface GetProductDraftByIdRequest {
  id: number;
}

export const getProductDraftById = (request: GetProductDraftByIdRequest) =>
  api.get<ProductConstructor>(`product/constructor/${request.id}/`);

export interface GetProductDraftRequest {
  params?: Partial<{
    page: number;
    page_size: number;
  }>;
}

export const getProductDrafts = (request?: GetProductDraftRequest) =>
  api.get<ProductDraftsResponse>('product/draft/products/', request);
