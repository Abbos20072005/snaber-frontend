import type { ReadyState } from 'react-use-websocket';

import { useLingui } from '@lingui/react/macro';
import { MoveRightIcon } from 'lucide-react';

import { useAuthed } from '@/modules/auth';
import { getConnectionLabel } from '@/modules/chat';

interface Props {
  conversation?: Conversation | null;
  readyState: ReadyState;
  thread?: ChatThread;
}

export const ChatConversationHeader = ({ conversation, readyState, thread }: Props) => {
  const { t } = useLingui();
  const { user } = useAuthed();

  const fullName =
    user.role === 'buyer'
      ? conversation?.seller.full_name
      : user.role === 'admin'
        ? conversation?.buyer.full_name
        : '';

  const email =
    user.role === 'buyer'
      ? conversation?.seller.email
      : user.role === 'admin'
        ? conversation?.buyer.email
        : '';

  return (
    <header className='flex w-full items-start justify-between gap-3 border-b px-5 py-4'>
      {user.role === 'admin' ? (
        <div className='flex w-full flex-1 items-center gap-5'>
          <div>
            <p className='text-primary text-sm font-semibold'>
              <span className='text-foreground'>{t`Seller`}:</span> {conversation?.buyer.full_name}
            </p>
            <p className='text-muted-foreground text-xs'>{conversation?.buyer.email}</p>
          </div>
          <MoveRightIcon className='text-primary size-5' />
          <div>
            <p className='text-primary text-sm font-semibold'>
              <span className='text-foreground'>{t`Buyer`}:</span> {conversation?.seller.full_name}
            </p>
            <p className='text-muted-foreground text-xs'>{conversation?.seller.email}</p>
          </div>
        </div>
      ) : (
        <div>
          <p className='text-base font-semibold'>{fullName ?? thread?.title}</p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            {conversation ? `${email} - ${getConnectionLabel(readyState)}` : t`Description`}
          </p>
        </div>
      )}
    </header>
  );
};
