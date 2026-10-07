import { api } from '@/shared/api';

export interface GetMiniSiteProductsRequest {
  id: number;
  params?: {
    search?: string;
    type?: string;
    category?: number | string;
    product_type?: string;
    min_price?: string;
    max_price?: string;
    page?: number;
    page_size?: number;
  };
}

export const getMiniSiteProducts = ({ id, params }: GetMiniSiteProductsRequest) =>
  api.get<MiniSiteProductPreviewsResponse>(`company/${id}/product/`, { params });
