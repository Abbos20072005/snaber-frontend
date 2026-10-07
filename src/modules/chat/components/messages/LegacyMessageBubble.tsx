import Linkify from 'react-linkify';

import { MessageAttachments } from '@/modules/chat/components/messages/MessageAttachments';
import { cn } from '@/shared/lib/utils';

interface Props {
  message: ChatMessage;
}

export const LegacyMessageBubble = ({ message }: Props) => {
  const isOwnMessage = message.author === 'me';
  const linkColor = isOwnMessage ? '#CFFAFE' : '#2563EB';
  const linkHoverColor = isOwnMessage ? '#FFFFFF' : '#1D4ED8';

  return (
    <div className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-xl rounded-md border px-3 py-2',
          isOwnMessage ? 'bg-primary' : 'bg-background'
        )}
      >
        <MessageAttachments
          attachments={message.files.map((file) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            url: file.link
          }))}
          isOwnMessage={isOwnMessage}
        />
        <p className={cn('text-sm leading-6', message.files.length > 0 && 'mt-2')}>
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a
                href={decoratedHref}
                key={key}
                className='font-medium underline underline-offset-2 transition-colors'
                rel='noreferrer'
                style={{ color: linkColor }}
                target='_blank'
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = linkHoverColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = linkColor;
                }}
              >
                {decoratedText}
              </a>
            )}
          >
            {message.content}
          </Linkify>
        </p>
        <p
          className={cn(
            'mt-1 text-[11px]',
            isOwnMessage ? 'text-muted text-end' : 'text-muted-foreground'
          )}
        >
          {message.sentAt}
        </p>
      </div>
    </div>
  );
};
