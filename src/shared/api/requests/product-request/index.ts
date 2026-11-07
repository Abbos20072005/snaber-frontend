import { api } from '@/shared/api';

export interface GetProductRequestsRequest {
  params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: ProductRequestStatus;
  };
}

export const getProductRequests = (request?: GetProductRequestsRequest) =>
  api.get<ProductRequestsResponse>('order/requests/', request);

export interface GetWantedProductsRequest {
  params?: {
    page?: number;
    page_size?: number;
    search?: string;
  };
}

export const getWantedProducts = (request?: GetWantedProductsRequest) =>
  api.get<WantedProductsResponse>('order/requests/wanted/', request);

interface PostProductRequestRequest {
  data: FormData;
}

export const postProductRequest = ({ data }: PostProductRequestRequest) =>
  api.post<ProductRequest>('order/requests/', data);

interface PatchProductRequestRequest {
  data: PatchProductRequestDto;
  id: number;
}

export const patchProductRequest = ({ data, id }: PatchProductRequestRequest) =>
  api.patch<ProductRequest>(`order/requests/${id}/`, data);
