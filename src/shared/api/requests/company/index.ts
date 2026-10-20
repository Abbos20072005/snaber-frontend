import { api, apiWithoutAuth } from '@/shared/api';

export interface GetAllCompaniesRequest {
  params?: Partial<{
    search: string;
    sort: SortType;
    page: number;
    page_size: number;
    is_popular: boolean;
  }>;
}

export const getAllCompanies = (request?: GetAllCompaniesRequest) =>
  apiWithoutAuth
    .get<GetAllCompanyResponse>('/company/public/', {
      params: request?.params
    })
    .then(({ data }) => data);

export interface GetCompanyDraftsRequest {
  params?: Partial<{
    search: string;
    sort: SortType;
    status: ProductDraftStatus;
    page: number;
    page_size: number;
    region: number;
    industry: number;
    product_type: ProductType;
  }>;
}

export interface GetCompanyIndustryRequest {
  params?: Partial<{
    page: number;
    page_size: number;
    search: string;
  }>;
}
export interface GetCompanyRegionsRequest {
  params?: Partial<{
    page: number;
    page_size: number;
    search: string;
  }>;
}

export const getAllCompanyIndustry = (request?: GetCompanyIndustryRequest) =>
  apiWithoutAuth.get<GetAllCompanyIndustryResponse>('/company/industries/', request);

export const getAllCompanyRegions = (request?: GetCompanyRegionsRequest) =>
  apiWithoutAuth.get<GetAllCompanyRegionsResonse>('/company/regions/', request);

export const getCompanyDrafts = (request?: GetCompanyDraftsRequest) =>
  api.get<GetCompanyDraftResponse>('company/draft/', request).then(({ data }) => data);

export interface PatchCompanyDraftRequest {
  id: number;
  data: {
    status: string;
    description_moderator: string;
  };
}

export const patchCompanyDraft = (request?: PatchCompanyDraftRequest) =>
  api.patch(`company/draft/${request?.id}/`, request?.data);

export interface DeleteCompanyRequest {
  id: number;
}

export const deleteCompany = (request: DeleteCompanyRequest) =>
  api.delete(`company/${request.id}/`);

export interface GetPublicCompanyByIdRequest {
  id: number;
}

export const getPublicCompanyById = ({ id }: GetPublicCompanyByIdRequest) =>
  apiWithoutAuth.get<MiniSite>(`company/public/${id}/`);
