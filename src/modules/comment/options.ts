import { queryOptions } from '@tanstack/react-query';

import type {
  GetCommentByIdRequest,
  GetCommentsRequest,
  GetProductCommentStatusRequest
} from '@/shared/api';

import { getCommentById, getComments, getProductCommentStatus } from '@/shared/api';

export const COMMENT_QUERY_KEYS = {
  base: () => ['comments'] as const,
  getList: (request?: GetCommentsRequest) =>
    [...COMMENT_QUERY_KEYS.base(), 'list', request] as const,
  getById: (request: GetCommentByIdRequest) =>
    [...COMMENT_QUERY_KEYS.base(), 'detail', request] as const,
  getStatus: (request: GetProductCommentStatusRequest) =>
    [...COMMENT_QUERY_KEYS.base(), 'check-status', request] as const
} as const;

export const getCommentsQueryOptions = (request?: GetCommentsRequest) =>
  queryOptions({
    queryKey: COMMENT_QUERY_KEYS.getList(request),
    queryFn: () => getComments(request)
  });

export const getCommentByIdQueryOptions = (request: GetCommentByIdRequest) =>
  queryOptions({
    queryKey: COMMENT_QUERY_KEYS.getById(request),
    queryFn: () => getCommentById(request)
  });

export const getProductCommentStatusQueryOptions = (request: GetProductCommentStatusRequest) =>
  queryOptions({
    queryKey: COMMENT_QUERY_KEYS.getStatus(request),
    queryFn: () => getProductCommentStatus(request)
  });
