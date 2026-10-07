import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { SiteCertificateSchemaForm } from '@/modules/mini-site';

import { SITE_CERTIFICATE_QUERY_KEYS, SiteCertificateForm } from '@/modules/mini-site';
import { patchCertificate, postCertificate } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

interface Props {
  company: number;
  defaultValues?: Partial<Certificate>;
  editValues?: Certificate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SiteCertificateFormDialog = ({
  open,
  onOpenChange,
  editValues,
  defaultValues,
  company
}: Props) => {
  const { t } = useLingui();
  const queryClient = useQueryClient();

  const isEdit = !!editValues;

  const postCertificateMutation = useMutation({
    mutationFn: postCertificate,
    onSuccess: () => {
      toast.success(t`Successfully created certificate.`);
      void queryClient.invalidateQueries({ queryKey: SITE_CERTIFICATE_QUERY_KEYS.all() });
      onOpenChange(false);
    },
    onError: () => toast.error(t`Failed to create certificate.`)
  });

  const patchCertificateMutation = useMutation({
    mutationFn: patchCertificate,
    onSuccess: () => {
      toast.success(t`Successfully updated certificate.`);
      void queryClient.invalidateQueries({ queryKey: SITE_CERTIFICATE_QUERY_KEYS.all() });
      onOpenChange(false);
    },
    onError: () => toast.error(t`Failed to update certificate.`)
  });

  const onSubmit = useCallback((value: SiteCertificateSchemaForm) => {
    const data = {
      ...value,
      file: value.file[0],
      company
    };

    if (isEdit) patchCertificateMutation.mutate({ id: editValues!.id, data });
    else postCertificateMutation.mutate({ data });
  }, []);

  const isPending = postCertificateMutation.isPending || patchCertificateMutation.isPending;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t`Update certificate` : t`Create certificate`}</DialogTitle>
        </DialogHeader>
        <SiteCertificateForm defaultValues={editValues || defaultValues} onSubmit={onSubmit} />
        <Button
          className='ml-auto w-fit'
          disabled={isPending}
          type='submit'
          form='site-certificate-form'
          loading={isPending}
        >{t`Save`}</Button>
      </DialogContent>
    </Dialog>
  );
};
