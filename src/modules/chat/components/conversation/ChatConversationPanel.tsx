import type { ComponentProps } from 'react';

import { useLingui } from '@lingui/react/macro';
import { useRef } from 'react';

import {
  ChatComposer,
  ChatConversationHeader,
  ChatMessagesList,
  useConversationMessages,
  useSendChatMessage,
  useUploadedFiles
} from '@/modules/chat';
import { cn } from '@/shared/lib/utils.ts';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  className?: ComponentProps<'div'>['className'];
  conversation?: Conversation | null;
  currentUserId?: number;
  isLoading?: boolean;
  thread?: ChatThread;
}

export const ChatConversationPanel = ({
  conversation,
  currentUserId,
  isLoading = false,
  thread,
  className
}: Props) => {
  const { t } = useLingui();
  const conversationId = conversation?.id ?? null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    messages,
    containerRef,
    messagesQuery,
    readyState
  } = useConversationMessages(conversationId);
  const { handleFilesUpload, handleRemoveUploadedFile, setUploadedFiles, uploadedFiles } =
    useUploadedFiles();
  const { handleSendMessage, isSending, newMessage, setNewMessage } = useSendChatMessage({
    conversationId,
    readyState,
    setUploadedFiles,
    uploadedFiles
  });

  if (isLoading) {
    return (
      <section className={cn('bg-card flex h-full w-full flex-1 flex-col', className)}>
        <header className='flex items-start justify-between gap-3 border-b px-5 py-4'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-36' />
            <Skeleton className='h-3 w-48' />
          </div>
          <Skeleton className='size-9 rounded-md' />
        </header>
        <div className='bg-muted/20 flex-1 space-y-4 overflow-hidden p-5'>
          <Skeleton className='h-14 w-3/4 rounded-md' />
          <Skeleton className='ml-auto h-14 w-2/3 rounded-md' />
          <Skeleton className='h-20 w-4/5 rounded-md' />
        </div>
        <div className='border-t p-4'>
          <Skeleton className='h-11 w-full rounded-md' />
        </div>
      </section>
    );
  }

  if (!conversation && !thread) {
    return (
      <section className='bg-card flex h-full w-full flex-1 items-center justify-center'>
        <p className='text-muted-foreground text-sm'>{t`Select a chat to start messaging.`}</p>
      </section>
    );
  }

  return (
    <section className={cn('bg-card flex h-full w-full flex-1 flex-col', className)}>
      <ChatConversationHeader readyState={readyState} thread={thread} conversation={conversation} />
      <ChatMessagesList
        currentUserId={currentUserId}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        messages={messages}
        thread={thread}
        containerRef={containerRef}
        isLoading={messagesQuery.isLoading}
        onFetchNextPage={() => fetchNextPage()}
      />
      <ChatComposer
        fileInputRef={fileInputRef}
        isSending={isSending}
        newMessage={newMessage}
        conversationId={conversationId}
        onFilesUpload={handleFilesUpload}
        onMessageChange={setNewMessage}
        onRemoveFile={handleRemoveUploadedFile}
        onSendMessage={handleSendMessage}
        uploadedFiles={uploadedFiles}
      />
    </section>
  );
};
