import type { ChangeEvent, RefObject } from 'react';

import { useLingui } from '@lingui/react/macro';
import { PaperclipIcon, SendIcon } from 'lucide-react';

import type { UploadedFileItem } from '@/modules/chat';

import { useAuthed } from '@/modules/auth';
import { UploadedFilePreview } from '@/modules/chat';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

interface Props {
  conversationId: number | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isSending: boolean;
  newMessage: string;
  uploadedFiles: UploadedFileItem[];
  onFilesUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onMessageChange: (message: string) => void;
  onRemoveFile: (id: string) => void;
  onSendMessage: () => void;
}

export const ChatComposer = ({
  conversationId,
  fileInputRef,
  isSending,
  newMessage,
  onFilesUpload,
  onMessageChange,
  onRemoveFile,
  onSendMessage,
  uploadedFiles
}: Props) => {
  const { t } = useLingui();
  const canSendMessage =
    !!conversationId && (!!newMessage.trim() || uploadedFiles.length > 0) && !isSending;

  const { user } = useAuthed();
  const shouldDisable = !(user.role === 'buyer' || user.role === 'admin');

  return (
    <div className='w-full border-t p-4'>
      <div className='space-y-2'>
        {uploadedFiles.length > 0 && (
          <div className='bg-muted/30 no-scrollbar mb-3 flex gap-2 overflow-auto rounded-md border p-2'>
            {uploadedFiles.map((item) => (
              <UploadedFilePreview key={item.id} item={item} onRemove={onRemoveFile} />
            ))}
          </div>
        )}
      </div>
      <div className={cn('flex gap-3', /[\r\n]/.test(newMessage) ? 'items-end' : 'items-center')}>
        <Button
          disabled={shouldDisable}
          size='icon'
          variant='outline'
          onClick={() => fileInputRef.current?.click()}
        >
          <PaperclipIcon />
        </Button>
        <Textarea
          className='max-h-60 min-h-9 w-full resize-none break-all whitespace-pre-wrap'
          disabled={!conversationId || shouldDisable}
          value={newMessage}
          onChange={(event) => onMessageChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || event.shiftKey) return;
            event.preventDefault();
            if (canSendMessage) onSendMessage();
          }}
          placeholder={t`Type a message`}
        />
        <div className='flex shrink-0 flex-col gap-1'>
          <Input hidden multiple ref={fileInputRef} type='file' onChange={onFilesUpload} />
          <Button
            disabled={!canSendMessage || shouldDisable}
            size='icon'
            type='button'
            onClick={onSendMessage}
          >
            <SendIcon className='mr-1 size-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};
