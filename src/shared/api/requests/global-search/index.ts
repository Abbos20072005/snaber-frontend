import { apiWithoutAuth } from '../../instance';

export interface GlobalSearchRequest {
  params: {
    search: string;
  };
}

export const getGlobalSearch = (request: GlobalSearchRequest) =>
  apiWithoutAuth.get<GetGlobalSearchResponse>('product/global-search/', request);
