import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/modules/auth';
import {
  ChatConversationPanel,
  ChatsListPanel,
  getConversationsInfiniteQueryOptions
} from '@/modules/chat';
import { PageContent } from '@/shared/ui/page';

interface Props {
  contentHeightClassName?: string;
}

export const ChatsPage = ({ contentHeightClassName = 'h-[calc(100vh-64px)]' }: Props) => {
  const { t } = useLingui();
  const { user } = useAuth();

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const conversationsQuery = useInfiniteQuery(
    getConversationsInfiniteQueryOptions({
      params: {
        page_size: 20
      }
    })
  );
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = conversationsQuery;

  const conversations = useMemo(
    () => conversationsQuery.data?.pages.flatMap((page) => page.results) ?? [],
    [conversationsQuery.data?.pages]
  );

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <PageContent className='p-0'>
      <main className={`bg-background flex ${contentHeightClassName} w-full flex-col md:flex-row`}>
        {conversationsQuery.isLoading ? (
          <aside className='bg-card flex h-full w-full items-center justify-center border-r md:max-w-sm'>
            <p className='text-muted-foreground text-sm'>{t`Loading...`}</p>
          </aside>
        ) : (
          <ChatsListPanel
            hasNextPage={Boolean(hasNextPage)}
            isFetchingNextPage={isFetchingNextPage}
            conversations={conversations}
            onLoadMore={handleLoadMore}
            onSelect={setSelectedConversationId}
            selectedConversationId={selectedConversation?.id ?? null}
          />
        )}
        <ChatConversationPanel currentUserId={user?.id} conversation={selectedConversation} />
      </main>
    </PageContent>
  );
};
