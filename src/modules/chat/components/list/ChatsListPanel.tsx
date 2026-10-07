import { useLingui } from '@lingui/react/macro';
import { SearchIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { ChatGroupsTabs, ConversationListItem } from '@/modules/chat';
import { Button } from '@/shared/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shared/ui/input-group';

interface Props {
  conversations: Conversation[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  selectedConversationId: number | null;
  onLoadMore: () => void;
  onSelect: (conversationId: number) => void;
}

export const ChatsListPanel = ({
  conversations,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onSelect,
  selectedConversationId
}: Props) => {
  const { t } = useLingui();
  const [search, setSearch] = useState('');
  const { inView, ref } = useInView({ rootMargin: '160px' });

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return conversations;

    return conversations.filter((conversation) => {
      const buyerName = conversation.buyer.full_name.toLowerCase();
      const buyerEmail = conversation.buyer.email.toLowerCase();
      const conversationId = String(conversation.id);

      return (
        buyerName.includes(normalizedSearch) ||
        buyerEmail.includes(normalizedSearch) ||
        conversationId.includes(normalizedSearch)
      );
    });
  }, [conversations, search]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) onLoadMore();
  }, [hasNextPage, inView, isFetchingNextPage, onLoadMore]);

  return (
    <aside className='bg-card relative h-full w-full overflow-y-auto border-r md:max-w-sm'>
      <div className='sticky top-0 z-1 space-y-2 border-b bg-white p-4 pt-4! pb-2'>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder={t`Search chats`}
          />
        </InputGroup>
        <ChatGroupsTabs />
      </div>
      <div className='divide-y'>
        {filteredConversations.length === 0 ? (
          <div className='text-muted-foreground flex h-[calc(100vh-20rem)] w-full items-center justify-center'>{t`There is no conversations`}</div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              isActive={conversation.id === selectedConversationId}
              conversation={conversation}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
      <div ref={ref} className='flex justify-center p-3'>
        {isFetchingNextPage ? (
          <p className='text-muted-foreground text-xs'>{t`Loading...`}</p>
        ) : hasNextPage ? (
          <Button size='xs' type='button' variant='outline' onClick={onLoadMore}>
            {t`Load more`}
          </Button>
        ) : null}
      </div>
    </aside>
  );
};
