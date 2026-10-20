import { api, apiWithoutAuth } from '@/shared/api';

export interface GetProductsRequest {
  params?: Partial<{
    search: string;
    category: number;
    is_active: boolean;
    in_stock: boolean;
    page: number;
    page_size: number;
  }>;
}

export const getProducts = (request?: GetProductsRequest) =>
  api.get<ProductPreviewsResponse>('product/', {
    params: request?.params
  });

export interface GetProductByIdRequest {
  id: number;
}

export const getProductById = ({ id }: GetProductByIdRequest) => api.get<Product>(`product/${id}/`);

export interface GetPublicProductsRequest {
  params?: Partial<{
    search: string;
    category: number | string;
    price_min: number;
    price_max: number;
    is_popular: boolean;
    page: number;
    page_size: number;
  }>;
}

export const getPublicProducts = (request?: GetPublicProductsRequest) =>
  apiWithoutAuth.get<PublicProductsResponse>('product/public/', request).then(({ data }) => data);

export interface GetPublicProductByIdRequest {
  id: number;
}

export const getPublicProductById = ({ id }: GetPublicProductByIdRequest) =>
  apiWithoutAuth.get<PublicProductResponse>(`product/public/${id}/`);

interface PostProductRequest {
  data: PostProductDto;
}

export const postProduct = ({ data }: PostProductRequest) => api.post<Product>('product/', data);

interface PatchProductRequest {
  data: PatchProductDto;
  id: number;
}

export const patchProduct = ({ id, data }: PatchProductRequest) =>
  api.patch<Product>(`product/${id}/`, data);

interface DeleteProductRequest {
  id: number;
}

export const deleteProduct = ({ id }: DeleteProductRequest) => api.delete(`product/${id}/`);

interface PostProductImagesRequest {
  files: File[];
  id: number;
}

export const postProductImages = ({ id, files }: PostProductImagesRequest) => {
  const data = new FormData();
  files.forEach((file) => data.append('files', file));

  return api.post<ProductMedia[]>(`product/${id}/images/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

interface DeleteProductImageRequest {
  id: number;
  imageId: number;
}

export const deleteProductImage = ({ id, imageId }: DeleteProductImageRequest) =>
  api.delete(`product/${id}/images/${imageId}/`);

export * from './attribute';
export * from './attribute-value';
export * from './comment';
export * from './unit-of-measure';
