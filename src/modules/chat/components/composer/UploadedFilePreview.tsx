import { FileIcon, XIcon } from 'lucide-react';

import type { UploadedFileItem } from '@/modules/chat';

import { formatFileSize } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';

interface Props {
  item: UploadedFileItem;
  onRemove: (id: string) => void;
}

export const UploadedFilePreview = ({ item, onRemove }: Props) => {
  return (
    <div className='bg-background relative flex size-24 shrink-0 flex-col overflow-hidden rounded-md border'>
      <Button
        className='absolute top-1 right-1 size-4.5'
        size='icon-xs'
        variant='destructive'
        onClick={() => onRemove(item.id)}
      >
        <XIcon className='size-2.5' />
      </Button>
      <div className='bg-muted/40 flex min-h-0 flex-1 items-center justify-center'>
        {item.isImage && item.previewUrl ? (
          <img alt={item.file.name} className='h-full w-full object-cover' src={item.previewUrl} />
        ) : (
          <FileIcon className='text-muted-foreground size-6' />
        )}
      </div>
      <div className='bg-background border-t px-1 py-1'>
        <p className='truncate text-[10px]' title={item.file.name}>
          {item.file.name}
        </p>
        <p className='text-muted-foreground text-[10px]'>{formatFileSize(item.file.size)}</p>
      </div>
    </div>
  );
};
