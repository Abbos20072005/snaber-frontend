import { queryOptions } from '@tanstack/react-query';

import type {
  GetCategoryBreadcrumbsRequest,
  GetCategoryByIdRequest,
  GetPublicCategoriesByIdRequest,
  PublicAllCategoriesRequest
} from '@/shared/api';

import {
  getCategories,
  getCategoryBreadcrumbById,
  getCategoryById,
  getPublicAllCategories,
  getPublicCategoryById
} from '@/shared/api';

export const CATEGORY_QUERY_KEYS = {
  all: () => ['categories'] as const,
  getAll: () => [...CATEGORY_QUERY_KEYS.all(), 'root-categories'] as const,
  getById: (request: GetCategoryByIdRequest) => [...CATEGORY_QUERY_KEYS.all(), request] as const,
  allPublic: (request?: PublicAllCategoriesRequest) =>
    [...CATEGORY_QUERY_KEYS.all(), 'public', request?.params] as const,
  publicById: (request?: GetPublicCategoriesByIdRequest) =>
    [...CATEGORY_QUERY_KEYS.all(), 'public', request] as const,
  breadcrumbById: (request: GetCategoryBreadcrumbsRequest) =>
    [...CATEGORY_QUERY_KEYS.all(), 'breadcrumb', request] as const
};

export const getCategoryByIdQueryOptions = (request: GetCategoryByIdRequest) =>
  queryOptions({
    queryKey: CATEGORY_QUERY_KEYS.getById(request),
    queryFn: () => getCategoryById(request)
  });

export const getAllCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: CATEGORY_QUERY_KEYS.getAll(),
    queryFn: () => getCategories()
  });

export const getPublicAllCategoriesOptions = (request?: PublicAllCategoriesRequest) =>
  queryOptions({
    queryKey: CATEGORY_QUERY_KEYS.allPublic(request),
    queryFn: () => getPublicAllCategories({ params: request?.params })
  });

export const getPublicCategoryByIdOptions = (request: GetPublicCategoriesByIdRequest) =>
  queryOptions({
    queryKey: CATEGORY_QUERY_KEYS.publicById(request),
    queryFn: () => getPublicCategoryById(request)
  });

export const getCategoryBreadcrumbByIdOptions = (request: GetCategoryBreadcrumbsRequest) =>
  queryOptions({
    queryKey: CATEGORY_QUERY_KEYS.breadcrumbById(request),
    queryFn: () => getCategoryBreadcrumbById(request)
  });
