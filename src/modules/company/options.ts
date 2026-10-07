import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

import type {
  GetAllCompanyMembers,
  GetMiniSiteByIdRequest,
  GetMiniSiteProductsRequest
} from '@/shared/api';
import type {
  GetAllCompaniesRequest,
  GetCompanyDraftsRequest,
  GetCompanyIndustryRequest,
  GetCompanyRegionsRequest,
  GetPublicCompanyByIdRequest
} from '@/shared/api/requests/company';

import {
  getAllMembers,
  getMiniSiteById,
  getMiniSiteProducts,
  getSellerMiniSite
} from '@/shared/api';
import {
  getAllCompanies,
  getAllCompanyIndustry,
  getAllCompanyRegions,
  getCompanyDrafts,
  getPublicCompanyById
} from '@/shared/api/requests/company';

export const MINI_SITE_QUERY_KEYS = {
  base: () => ['mini-site'] as const,
  getById: (request: GetMiniSiteByIdRequest) => [...MINI_SITE_QUERY_KEYS.base(), request] as const,
  getBySeller: () => [...MINI_SITE_QUERY_KEYS.base(), 'seller'] as const,
  getMiniSiteProducts: (request: GetMiniSiteProductsRequest) =>
    [...MINI_SITE_QUERY_KEYS.base(), 'site-products', request] as const
};

export const getMiniSiteProductsQueryOptions = (request: GetMiniSiteProductsRequest) =>
  queryOptions({
    queryKey: MINI_SITE_QUERY_KEYS.getMiniSiteProducts(request),

    queryFn: () => getMiniSiteProducts(request)
  });

export const getMiniSiteProductsInfiniteQueryOptions = (request: GetMiniSiteProductsRequest) =>
  infiniteQueryOptions({
    queryKey: MINI_SITE_QUERY_KEYS.getMiniSiteProducts(request),

    queryFn: ({ pageParam = 1 }) =>
      getMiniSiteProducts({
        ...request,
        params: {
          ...request.params,
          page: pageParam
        }
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.next ? allPages.length + 1 : undefined,
    placeholderData: keepPreviousData
  });

export const getMiniSiteByIdQueryOptions = (request: GetMiniSiteByIdRequest) =>
  queryOptions({
    queryKey: MINI_SITE_QUERY_KEYS.getById(request),
    queryFn: () => getMiniSiteById(request)
  });

export const getMiniSiteBySellerQueryOptions = () =>
  queryOptions({
    queryKey: MINI_SITE_QUERY_KEYS.getBySeller(),
    queryFn: getSellerMiniSite,
    meta: {
      withoutToastOnError: true
    }
  });

export const COMPANY_QUERY_KEYS = {
  base: () => ['companies'] as const,
  getAll: (request?: GetAllCompaniesRequest) => [...COMPANY_QUERY_KEYS.base(), request] as const,
  getPublicById: (request: GetPublicCompanyByIdRequest) =>
    [...COMPANY_QUERY_KEYS.base(), request] as const,
  getCompanyDrafts: (request?: GetCompanyDraftsRequest) =>
    [...COMPANY_QUERY_KEYS.base(), 'draft', request] as const
} as const;

export const getAllCompaniesInfiniteOptions = (request?: GetAllCompaniesRequest) =>
  infiniteQueryOptions({
    queryKey: COMPANY_QUERY_KEYS.getAll(request),
    queryFn: ({ pageParam = 1 }) =>
      getAllCompanies({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    getNextPageParam: (lastPage, allPage) => (lastPage.next ? allPage.length + 1 : undefined),
    placeholderData: keepPreviousData,
    initialPageParam: 1
  });

export const COMPANY_FILTER_QUERY_KEYS = {
  getAllIndustry: (request?: GetCompanyIndustryRequest) => ['industry', request] as const,
  getAllRegions: (request?: GetCompanyRegionsRequest) => ['regions', request] as const
} as const;

export const getAllCompanyIndustryInfiniteOptions = (request?: GetCompanyIndustryRequest) =>
  infiniteQueryOptions({
    queryKey: COMPANY_FILTER_QUERY_KEYS.getAllIndustry(request),
    queryFn: ({ pageParam = 1 }) =>
      getAllCompanyIndustry({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    getNextPageParam: (lastPage, allPage) => (lastPage.data.next ? allPage.length + 1 : undefined),
    placeholderData: keepPreviousData,
    initialPageParam: 1
  });

export const getAllCompanyRegionsInfiniteOptions = (request?: GetCompanyRegionsRequest) =>
  infiniteQueryOptions({
    queryKey: COMPANY_FILTER_QUERY_KEYS.getAllRegions(request),
    queryFn: ({ pageParam = 1 }) =>
      getAllCompanyRegions({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    getNextPageParam: (lastPage, allPage) => (lastPage.data.next ? allPage.length + 1 : undefined),
    placeholderData: keepPreviousData,
    initialPageParam: 1
  });

export const getPublicCompanyByIdOptions = (request: GetPublicCompanyByIdRequest) =>
  queryOptions({
    queryKey: COMPANY_QUERY_KEYS.getPublicById(request),
    queryFn: () => getPublicCompanyById(request).then((data) => data.data)
  });

export const getAllTopCompaniesOptions = (request?: GetAllCompaniesRequest) =>
  queryOptions({
    queryKey: COMPANY_QUERY_KEYS.getAll(request),
    queryFn: () => getAllCompanies(request)
  });

export const getCompanyDraftsQueryOptions = (request?: GetCompanyDraftsRequest) =>
  queryOptions({
    queryKey: COMPANY_QUERY_KEYS.getCompanyDrafts(request),
    queryFn: () => getCompanyDrafts(request)
  });

export const COMPANY_MEMBERS_QUERY_KEYS = {
  base: () => ['members'] as const,
  getAll: (request?: GetAllCompanyMembers) =>
    [...COMPANY_MEMBERS_QUERY_KEYS.base(), request] as const
};

export const getAllMembersInfiniteOptions = (request?: GetAllCompanyMembers) =>
  infiniteQueryOptions({
    queryKey: COMPANY_MEMBERS_QUERY_KEYS.getAll(request),
    queryFn: ({ pageParam = 1 }) =>
      getAllMembers({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    getNextPageParam: (lastPage, allPage) => (lastPage.data.next ? allPage.length + 1 : undefined),
    placeholderData: keepPreviousData,
    initialPageParam: 1
  });
