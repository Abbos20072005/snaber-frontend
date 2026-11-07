import { keepPreviousData, queryOptions } from '@tanstack/react-query';

import type { GetUserByIdRequest, GetUsersRequest } from '@/shared/api/requests/user';

import { getUserById, getUsers } from '@/shared/api/requests/user';

export const USERS_QUERY_KEYS = {
  base: () => ['users'] as const,
  detail: (request: GetUserByIdRequest) => [...USERS_QUERY_KEYS.base(), 'detail', request] as const,
  lists: () => [...USERS_QUERY_KEYS.base(), 'list'] as const,
  list: (request?: GetUsersRequest) => [...USERS_QUERY_KEYS.lists(), request] as const
} as const;

export const getUsersQueryOptions = (request?: GetUsersRequest) =>
  queryOptions({
    queryKey: USERS_QUERY_KEYS.list(request),
    queryFn: () => getUsers(request).then((res) => res.data),
    placeholderData: keepPreviousData
  });

export const getUserByIdQueryOptions = (request: GetUserByIdRequest) =>
  queryOptions({
    queryKey: USERS_QUERY_KEYS.detail(request),
    queryFn: () => getUserById(request).then((res) => res.data)
  });
