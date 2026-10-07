import { useMutation } from '@tanstack/react-query';

import { conversationReadById } from '@/shared/api';
import { formatLocaleDate } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils.ts';
import { Badge } from '@/shared/ui/badge';

import { CHAT_QUERY_KEYS } from '../../options';

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (conversationId: number) => void;
}

export const ConversationListItem = ({ conversation, isActive, onSelect }: Props) => {
  const conversationReadMutation = useMutation({
    mutationFn: conversationReadById,
    meta: {
      invalidatesQuery: CHAT_QUERY_KEYS.base()
    }
  });

  const chatSelected = ({ id }: { id: number }) => {
    conversationReadMutation.mutate({ id });
    onSelect(id);
  };

  return (
    <button
      key={conversation.id}
      className={cn(
        'hover:bg-muted/40 flex w-full items-start gap-3 p-4 text-left transition-colors',
        isActive && 'bg-primary-foreground'
      )}
      type='button'
      onClick={() => chatSelected({ id: conversation.id })}
    >
      <span className='mt-1 size-2.5 shrink-0 rounded-full bg-emerald-600' />
      <div className='grid min-w-0 flex-1 grid-cols-2 gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='truncate text-sm font-medium'>{conversation.buyer.full_name}</p>
          <p className='text-muted-foreground truncate text-xs'>{conversation.buyer.email}</p>
        </div>

        <div className='flex flex-col items-end gap-1'>
          <span className='text-muted-foreground shrink-0 text-xs'>
            {formatLocaleDate(conversation.updated_at, 'PP HH:mm')}
          </span>
          {conversation.unread_message_count > 0 && (
            <Badge className='text-xs'>
              {conversation.unread_message_count > 99 ? '99+' : conversation.unread_message_count}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
};
