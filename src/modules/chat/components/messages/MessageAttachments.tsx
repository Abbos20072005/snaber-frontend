import { DownloadIcon, FileIcon, FileTextIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface MessageAttachment {
  id: number | string;
  name?: string;
  type?: string;
  url: string;
}

interface Props {
  attachments: MessageAttachment[];

  isOwnMessage: boolean;
}

const imageExtensions = ['.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp'];

const getFileName = (url: string, name?: string) => {
  if (name) return name;

  try {
    const pathname = new URL(url).pathname;
    const fileName = pathname.split('/').filter(Boolean).at(-1);

    return fileName ? decodeURIComponent(fileName) : url;
  } catch {
    const fileName = url.split('/').filter(Boolean).at(-1);

    return fileName ? decodeURIComponent(fileName) : url;
  }
};

const getFileExtension = (fileName: string) => {
  const extension = fileName.split('.').at(-1);

  return extension && extension !== fileName ? extension.toUpperCase() : 'FILE';
};

const isImageAttachment = ({ type, url }: MessageAttachment) => {
  if (type?.toLowerCase() === 'image') return true;

  const normalizedUrl = url.split('?')[0].toLowerCase();

  return imageExtensions.some((extension) => normalizedUrl.endsWith(extension));
};

export const MessageAttachments = ({ attachments, isOwnMessage }: Props) => {
  if (attachments.length === 0) return null;

  return (
    <div className='space-y-2'>
      {attachments.map((attachment) => {
        const fileName = getFileName(attachment.url, attachment.name);
        const fileExtension = getFileExtension(fileName);

        if (isImageAttachment(attachment)) {
          return (
            <a
              href={attachment.url}
              key={attachment.id}
              className={cn(
                'block overflow-hidden rounded-xl border transition-opacity hover:opacity-95',
                isOwnMessage ? 'border-white/20' : 'border-border'
              )}
              rel='noreferrer'
              target='_blank'
            >
              <img
                alt={fileName}
                className='h-72 w-full max-w-80 min-w-56 object-cover'
                src={attachment.url}
              />
            </a>
          );
        }

        return (
          <a
            href={attachment.url}
            key={attachment.id}
            className={cn(
              'flex max-w-80 min-w-64 items-center gap-3 rounded-xl border p-2.5 text-left transition-colors',
              isOwnMessage
                ? 'border-white/25 bg-white/10 text-white hover:bg-white/15'
                : 'border-border bg-muted/50 text-foreground hover:bg-muted'
            )}
            rel='noreferrer'
            target='_blank'
          >
            <span
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-full',
                isOwnMessage ? 'text-primary bg-white' : 'bg-primary text-primary-foreground'
              )}
            >
              {fileExtension === 'PDF' ? (
                <FileTextIcon className='size-5' />
              ) : (
                <FileIcon className='size-5' />
              )}
            </span>
            <span className='min-w-0 flex-1'>
              <span className='block truncate text-sm font-medium'>{fileName}</span>
              <span
                className={cn(
                  'mt-0.5 block text-xs',
                  isOwnMessage ? 'text-white/70' : 'text-muted-foreground'
                )}
              >
                {fileExtension}
              </span>
            </span>
            <DownloadIcon
              className={cn(
                'size-4 shrink-0',
                isOwnMessage ? 'text-white/70' : 'text-muted-foreground'
              )}
            />
          </a>
        );
      })}
    </div>
  );
};
