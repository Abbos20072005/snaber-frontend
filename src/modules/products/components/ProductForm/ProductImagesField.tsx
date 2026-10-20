import { useLingui } from '@lingui/react/macro';
import { Trash2Icon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';

interface Props {
  deletingId?: number;
  medias: ProductMedia[];
  onDelete: (media: ProductMedia) => void;
}

// Images already saved on the server; new files are picked in the form's own upload field.
export const ProductImagesField = ({ medias, deletingId, onDelete }: Props) => {
  const { t } = useLingui();

  if (medias.length === 0) return null;

  return (
    <div className='grid gap-2'>
      <Label>{t`Current images`}</Label>
      <div className='flex flex-wrap gap-3'>
        {medias.map((media, index) => (
          <div key={media.id} className='group relative'>
            <img
              alt={`${index + 1}`}
              className='bg-muted size-24 rounded-md border object-cover'
              src={media.file}
            />
            {index === 0 && (
              <span className='bg-primary text-primary-foreground absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[10px] font-medium'>
                {t`Cover`}
              </span>
            )}
            <Button
              aria-label={t`Delete image`}
              className='absolute top-1 right-1 size-7'
              disabled={deletingId === media.id}
              size='icon'
              type='button'
              variant='destructive'
              onClick={() => onDelete(media)}
            >
              <Trash2Icon className='size-3.5' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
