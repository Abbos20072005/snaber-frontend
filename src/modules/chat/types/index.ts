import type { InfiniteData } from '@tanstack/react-query';

export interface UploadedFileItem {
  file: File;
  id: string;
  isImage: boolean;
  previewUrl: string | null;
}

export type MessagesInfiniteData = InfiniteData<
  {
    data: MessagesResponse;
  },
  number
>;
