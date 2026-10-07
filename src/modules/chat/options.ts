import { infiniteQueryOptions } from '@tanstack/react-query';

import type {
  GetConversationByOrderRequest,
  GetConversationsRequest,
  GetMessagesRequest
} from '@/shared/api';

import { getConversationByOrder, getConversations, getMessages } from '@/shared/api';

export const CHAT_QUERY_KEYS = {
  base: () => ['conversations'] as const,
  getAll: (request?: GetConversationsRequest) =>
    [...CHAT_QUERY_KEYS.base(), 'list', request] as const,
  getByOrder: (request: GetConversationByOrderRequest) =>
    [...CHAT_QUERY_KEYS.base(), 'getByOrder', request] as const
};

export const getConversationByOrderQueryOptions = (request: GetConversationByOrderRequest) => ({
  queryKey: CHAT_QUERY_KEYS.getByOrder(request),
  queryFn: () => getConversationByOrder(request)
});

export const getConversationsInfiniteQueryOptions = (request?: GetConversationsRequest) =>
  infiniteQueryOptions({
    queryKey: CHAT_QUERY_KEYS.getAll(request),
    queryFn: ({ pageParam = 1 }) =>
      getConversations({
        ...request,
        params: {
          ...request?.params,
          page: pageParam
        }
      }),
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined),
    initialPageParam: 1
  });

export const MESSAGES_QUERY_KEYS = {
  base: () => ['messages'] as const,
  getAll: (request: GetMessagesRequest) => [...MESSAGES_QUERY_KEYS.base(), 'list', request] as const
};

export const getMessagesInfiniteQueryOptions = (request: GetMessagesRequest) =>
  infiniteQueryOptions({
    queryKey: MESSAGES_QUERY_KEYS.getAll(request),
    queryFn: ({ pageParam = 1 }) =>
      getMessages({
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
