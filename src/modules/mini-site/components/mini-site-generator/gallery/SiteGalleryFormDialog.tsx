import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { SITE_GALLERY_QUERY_KEYS, SiteGalleryForm } from '@/modules/mini-site';
import { patchGallery, postGallery } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { SiteGallerySchemaForm } from './SiteGalleryForm';

interface Props {
  company: number;
  defaultValues?: Partial<Gallery>;
  editValues?: Gallery;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SiteGalleryFormDialog = ({
  open,
  onOpenChange,
  editValues,
  defaultValues,
  company
}: Props) => {
  const { t } = useLingui();
  const queryClient = useQueryClient();

  const isEdit = !!editValues;

  const postGalleryMutation = useMutation({
    mutationFn: postGallery,
    onSuccess: () => {
      toast.success(t`Successfully created gallery.`);
      void queryClient.invalidateQueries({ queryKey: SITE_GALLERY_QUERY_KEYS.all() });
      onOpenChange(false);
    },
    onError: () => toast.error(t`Failed to create gallery.`)
  });

  const patchGalleryMutation = useMutation({
    mutationFn: patchGallery,
    onSuccess: () => {
      toast.success(t`Successfully updated gallery.`);
      void queryClient.invalidateQueries({ queryKey: SITE_GALLERY_QUERY_KEYS.all() });
      onOpenChange(false);
    },
    onError: () => toast.error(t`Failed to update gallery.`)
  });

  const onSubmit = useCallback((value: SiteGallerySchemaForm) => {
    const data = {
      ...value,
      image: value.image[0],
      company
    };
    if (isEdit) patchGalleryMutation.mutate({ id: editValues!.id!, data });
    else postGalleryMutation.mutate({ data });
  }, []);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update gallery` : t`Create gallery`}</DialogTitle>
        </DialogHeader>
        <SiteGalleryForm defaultValues={editValues || defaultValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          disabled={postGalleryMutation.isPending || patchGalleryMutation.isPending}
          type='submit'
          form='site-gallery-form'
          loading={postGalleryMutation.isPending || patchGalleryMutation.isPending}
        >{t`Save`}</Button>
      </DialogContent>
    </Dialog>
  );
};
