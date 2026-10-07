import { api } from '@/shared/api';

export interface GetProductsRequest {
  params?: Partial<{
    status: ProductDraftStatus;
    search: string;
    page: number;
    page_size: number;
    slug: string;
    product_type: ProductType;
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
    product_type: ProductType;
    price_type: PriceType;
    price_min: number;
    price_max: number;
    is_popular: boolean;
    page: number;
    page_size: number;
  }>;
}

export const getPublicProducts = (request?: GetPublicProductsRequest) =>
  api.get<PublicProductsResponse>('product/public/', request).then(({ data }) => data);

export interface GetPublicProductByIdRequest {
  id: number;
}

export const getPublicProductById = ({ id }: GetPublicProductByIdRequest) =>
  api.get<PublicProductResponse>(`product/public/${id}/`);

interface PostProductRequest {
  data: PostProductDto;
}

export const postProduct = ({ data }: PostProductRequest) =>
  api.post<ProductConstructorPreview>('product/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchProductRequest {
  data: PatchProductDto;
  id: number;
}

export const patchProduct = ({ id, data }: PatchProductRequest) =>
  api.patch<Product>(`product/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface DeleteProductRequest {
  id: number;
}

export const deleteProduct = ({ id }: DeleteProductRequest) => api.delete(`product/${id}/`);

export * from './attribute';
export * from './attribute-value';
export * from './comment';
export * from './draft';
export * from './product-variant';
export * from './unit-of-measure';
