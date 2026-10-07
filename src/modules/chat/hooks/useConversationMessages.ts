import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

import type { MessagesInfiniteData } from '@/modules/chat';

import {
  getChatWebSocketUrl,
  getMessagesInfiniteQueryOptions,
  MESSAGES_QUERY_KEYS
} from '@/modules/chat';

export const useConversationMessages = (conversationId: number | null) => {
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const messageQueryRequest = useMemo(
    () => ({
      id: conversationId ?? 0,
      params: {
        page_size: 1000000
      }
    }),
    [conversationId]
  );

  const messagesQuery = useInfiniteQuery({
    ...getMessagesInfiniteQueryOptions(messageQueryRequest),
    enabled: !!conversationId
  });

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = messagesQuery;
  const messages = messagesQuery.data?.pages.flatMap((page) => page.data.results) ?? [];
  const socketUrl = getChatWebSocketUrl(conversationId);

  const { lastJsonMessage, readyState } = useWebSocket<Message>(socketUrl, {
    shouldReconnect: () => !!conversationId,
    share: false
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!lastJsonMessage || !conversationId) return;

    queryClient.setQueryData<MessagesInfiniteData>(
      MESSAGES_QUERY_KEYS.getAll(messageQueryRequest),
      (prev) => {
        if (!prev) return prev;

        const alreadyExists = prev.pages.some((page) =>
          page.data.results.some((message) => message.id === lastJsonMessage.id)
        );

        if (alreadyExists) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  data: {
                    ...page.data,
                    count: page.data.count + 1,
                    results: [...page.data.results, lastJsonMessage]
                  }
                }
              : page
          )
        };
      }
    );

    const timeoutId = setTimeout(() => scrollToBottom());

    return () => clearTimeout(timeoutId);
  }, [conversationId, lastJsonMessage, messageQueryRequest, queryClient]);

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    messages,
    containerRef,
    messagesQuery,
    readyState
  };
};
