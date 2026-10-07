import type { RefObject } from 'react';

import { useLingui } from '@lingui/react/macro';

import { LegacyMessageBubble, MessageBubble } from '@/modules/chat';

interface Props {
  containerRef: RefObject<HTMLDivElement | null>;
  currentUserId?: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  messages: Message[];
  thread?: ChatThread;
  onFetchNextPage: () => void;
}

export const ChatMessagesList = ({
  currentUserId,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  messages,
  containerRef,
  onFetchNextPage,
  thread
}: Props) => {
  const { t } = useLingui();

  return (
    <div
      ref={containerRef}
      className='bg-muted/20 no-scrollbar flex-1 space-y-3 overflow-y-auto p-5'
    >
      {!thread && hasNextPage && (
        <div className='flex justify-center'>
          <button
            className='text-muted-foreground text-xs'
            disabled={isFetchingNextPage}
            type='button'
            onClick={onFetchNextPage}
          >
            {isFetchingNextPage ? t`Loading...` : t`Load older messages`}
          </button>
        </div>
      )}
      {thread ? (
        thread.messages.map((message) => <LegacyMessageBubble key={message.id} message={message} />)
      ) : isLoading ? (
        <p className='text-muted-foreground bg-background rounded-md border p-4 text-center text-sm'>
          {t`Loading...`}
        </p>
      ) : messages.length ? (
        messages.map((message) => (
          <MessageBubble key={message.id} currentUserId={currentUserId} message={message} />
        ))
      ) : (
        <p className='text-muted-foreground bg-background rounded-md border p-4 text-center text-sm'>
          {t`No messages yet.`}
        </p>
      )}
    </div>
  );
};
