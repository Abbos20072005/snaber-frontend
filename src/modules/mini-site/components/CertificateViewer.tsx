import { useLingui } from '@lingui/react/macro';
import { FileTextIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';

interface CertificateViewerProps {
  file: string;
  title: string;
}

export const CertificateViewer = ({ file, title }: CertificateViewerProps) => {
  const { t } = useLingui();
  const [open, setOpen] = useState<boolean>(false);
  const links = useMemo(() => [file], [file]);

  const { files, isLoading, isError } = useFileFetcher({ links, enabled: open });
  const fetchedFile = files[0];
  const objectUrl = useMemo(() => {
    if (!open || !fetchedFile) return null;

    return URL.createObjectURL(fetchedFile);
  }, [fetchedFile, open]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button className='mt-3' size='sm' variant='default'>
            {t`View document`}
            <FileTextIcon className='size-3.5' />
          </Button>
        }
      />
      <DialogContent className='flex h-[95vh] w-full max-w-[95vw] flex-col gap-4 sm:max-w-[90vw]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className='text-muted-foreground flex flex-1 items-center justify-center text-sm'>
            {t`Loading...`}
          </div>
        )}
        {isError && (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 text-sm'>
            <p className='text-muted-foreground'>{t`Failed to load document`}</p>
            <a
              href={file}
              className='text-primary underline underline-offset-4'
              rel='noreferrer'
              target='_blank'
            >
              {t`Open in new tab`}
            </a>
          </div>
        )}
        {!isLoading && !isError && objectUrl && (
          <iframe
            className='min-h-0 w-full flex-1 rounded-lg border border-slate-200'
            src={objectUrl}
            title={title}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
