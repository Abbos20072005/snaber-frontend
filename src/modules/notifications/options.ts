import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { GetNotificationsRequest } from '@/shared/api';

import { getNotifications, getUnreadNotificationCount } from '@/shared/api';

export const NOTIFICATIONS_QUERY_KEYS = {
  base: () => ['notifications'] as const,
  getAll: (request?: GetNotificationsRequest) =>
    [...NOTIFICATIONS_QUERY_KEYS.base(), 'list', request] as const,
  getAllInfinite: (request?: GetNotificationsRequest) =>
    [...NOTIFICATIONS_QUERY_KEYS.getAll(request), 'infinite'] as const,
  getHeader: () => [...NOTIFICATIONS_QUERY_KEYS.base(), 'header'] as const,
  getUnreadCount: () => [...NOTIFICATIONS_QUERY_KEYS.base(), 'unread-count'] as const
};

export const getNotificationsQueryOptions = (request?: GetNotificationsRequest) =>
  queryOptions({
    queryKey: NOTIFICATIONS_QUERY_KEYS.getAll(request),
    queryFn: () => getNotifications(request)
  });

export const getNotificationsInfiniteQueryOptions = (request?: GetNotificationsRequest) =>
  infiniteQueryOptions({
    queryKey: NOTIFICATIONS_QUERY_KEYS.getAllInfinite(request),
    queryFn: ({ pageParam = 1 }) =>
      getNotifications({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.next ? allPages.length + 1 : undefined,
    initialPageParam: 1
  });

export const getHeaderNotificationsQueryOptions = () =>
  queryOptions({
    queryKey: NOTIFICATIONS_QUERY_KEYS.getHeader(),
    queryFn: () =>
      getNotifications({
        params: {
          page: 1,
          page_size: 5
        }
      })
  });

export const getUnreadNotificationCountQueryOptions = () =>
  queryOptions({
    queryKey: NOTIFICATIONS_QUERY_KEYS.getUnreadCount(),
    queryFn: getUnreadNotificationCount
  });
